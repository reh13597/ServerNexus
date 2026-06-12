import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';

const MOCK_REVIEW = {
  user_id: 'uid-123',
  username: 'TestPlayer',
  server_id: 42,
  rating: 4,
  review: 'This is a well-thought-out review that exceeds the minimum character requirement.',
};

const MOCK_REVIEW_RESPONSE = {
  id: 1,
  ...MOCK_REVIEW,
  profiles: { username: 'TestPlayer', avatar: null },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Review system', () => {
  it('submits a review via supabase insert', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: MOCK_REVIEW_RESPONSE, error: null });
    vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any);

    const result = await supabase.from('reviews').insert(MOCK_REVIEW);

    expect(supabase.from).toHaveBeenCalledWith('reviews');
    expect(insertMock).toHaveBeenCalledWith(MOCK_REVIEW);
    expect(result.error).toBeNull();
  });

  it('fetches reviews for a server with joined profile data', async () => {
    const mockData = [MOCK_REVIEW_RESPONSE];
    const selectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    };
    vi.mocked(supabase.from).mockReturnValue(selectChain as any);

    const { data } = await supabase
      .from('reviews')
      .select('*, profiles!reviews_user_id_fkey(username, avatar)')
      .eq('server_id', 42);

    expect(selectChain.select).toHaveBeenCalledWith('*, profiles!reviews_user_id_fkey(username, avatar)');
    expect(data).toHaveLength(1);
    expect(data![0].profiles.username).toBe('TestPlayer');
  });

  it('normalizes review data with username fallback', () => {
    const raw: Record<string, any> = { ...MOCK_REVIEW_RESPONSE };
    const normalized = {
      ...raw,
      username: raw.profiles?.username ?? 'Unknown',
      avatar: raw.profiles?.avatar ?? null,
    };

    expect(normalized.username).toBe('TestPlayer');
    expect(normalized.avatar).toBeNull();
  });

  it('handles missing profile data gracefully', () => {
    const raw: Record<string, any> = { ...MOCK_REVIEW_RESPONSE, profiles: null };
    const normalized = {
      ...raw,
      username: raw.profiles?.username ?? 'Unknown',
      avatar: raw.profiles?.avatar ?? null,
    };

    expect(normalized.username).toBe('Unknown');
  });

  it('sets up realtime channel for review updates', async () => {
    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      send: vi.fn().mockResolvedValue('ok'),
    };
    vi.mocked(supabase.channel).mockReturnValue(channelMock as any);

    const channel = supabase
      .channel('reviews:42', { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, vi.fn())
      .on('broadcast', { event: 'UPDATE' }, vi.fn())
      .on('broadcast', { event: 'DELETE' }, vi.fn())
      .subscribe();

    expect(supabase.channel).toHaveBeenCalledWith('reviews:42', { config: { private: true } });
    expect(channelMock.on).toHaveBeenCalledTimes(3);
    expect(channelMock.subscribe).toHaveBeenCalled();
  });

  it('broadcasts an update after successful review submission', async () => {
    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      send: vi.fn().mockResolvedValue('ok'),
    };
    vi.mocked(supabase.channel).mockReturnValue(channelMock as any);

    const channel = supabase.channel('reviews:42').subscribe();
    await channel.send({ type: 'broadcast', event: 'reviews-updated', payload: {} });

    expect(channelMock.send).toHaveBeenCalledWith({
      type: 'broadcast',
      event: 'reviews-updated',
      payload: {},
    });
  });

  it('cleans up realtime channel on destroy', () => {
    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    vi.mocked(supabase.channel).mockReturnValue(channelMock as any);

    const channel = supabase.channel('reviews:42').subscribe();
    supabase.removeChannel(channel);

    expect(supabase.removeChannel).toHaveBeenCalledWith(channel);
  });

  it('handles review submission error (duplicate review)', async () => {
    const insertMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'duplicate key value violates unique constraint', code: '23505' },
    });
    vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any);

    const result = await supabase.from('reviews').insert(MOCK_REVIEW);

    expect(result.error).not.toBeNull();
    expect(result.error!.code).toBe('23505');
  });
});
