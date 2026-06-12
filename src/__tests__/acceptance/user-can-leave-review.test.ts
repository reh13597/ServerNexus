import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import ReviewPanel from '../../lib/components/ServerInfo/ReviewPanel.svelte';
import { supabase } from '../../lib/supabase';
import { isLoggedIn } from '../../lib/stores/login';
import { userID, username } from '../../lib/stores/user';

const mockProfile = {
  id: '42',
  host: 'test.server.com',
  port: 25565,
  icon: null,
  avg_rating: 0,
  review_count: 0,
  save_count: 0,
};

beforeEach(() => {
  isLoggedIn.set(true);
  userID.set('uid-123');
  username.set('ReviewWriter');
  vi.clearAllMocks();

  // Mock empty review list initially
  vi.mocked(supabase.from).mockImplementation((table: string) => {
    if (table === 'reviews') {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any;
    }
    return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ data: [], error: null }) } as any;
  });
});

describe('User story: User can leave a review', () => {
  it('shows the review form with star rating and textarea', () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByText(/rate & review/i)).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByPlaceholderText(/write your review/i)).toBeInTheDocument();
  });

  it('submit is disabled without rating or text', () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
  });

  it('submit is disabled with rating but text under 40 chars', async () => {
    render(ReviewPanel, { props: { profile: mockProfile } });

    const stars = screen.getAllByRole('radio');
    await fireEvent.click(stars[4]); // 5 stars

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, { target: { value: 'Too short' } });

    expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
  });

  it('submit becomes enabled with rating and 40+ char text', async () => {
    render(ReviewPanel, { props: { profile: mockProfile } });

    const stars = screen.getAllByRole('radio');
    await fireEvent.click(stars[3]); // 4 stars

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, {
      target: { value: 'This server is absolutely fantastic and I would recommend it to anyone!' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit review/i })).not.toBeDisabled();
    });
  });

  it('shows character counter when review is too short', async () => {
    render(ReviewPanel, { props: { profile: mockProfile } });

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, { target: { value: 'Hello world' } });

    await waitFor(() => {
      expect(screen.getByText(/29 more characters required/i)).toBeInTheDocument();
    });
  });

  it('submits review and shows success message', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null });
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'reviews') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: insertMock,
        } as any;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ data: [], error: null }) } as any;
    });

    render(ReviewPanel, { props: { profile: mockProfile } });

    const stars = screen.getAllByRole('radio');
    await fireEvent.click(stars[3]);

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, {
      target: { value: 'This server is absolutely fantastic and I would recommend it to anyone!' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit review/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /submit review/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'uid-123',
          server_id: '42',
          rating: 4,
        })
      );
    });
  });

  it('prompts login when not logged in', () => {
    isLoggedIn.set(false);
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.queryByText(/rate & review/i)).not.toBeInTheDocument();
  });
});
