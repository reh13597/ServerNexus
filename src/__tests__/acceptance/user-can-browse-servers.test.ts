import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor, cleanup } from '@testing-library/svelte';
import Explore from '../../lib/pages/features/Explore.svelte';
import { supabase } from '../../lib/supabase';
import { isLoggedIn } from '../../lib/stores/login';
import { userID } from '../../lib/stores/user';

const MOCK_SERVERS = [
  { id: 1, host: 'hypixel.net', port: 25565, icon: null, avg_rating: 4.5 },
  { id: 2, host: 'mineplex.com', port: 25565, icon: null, avg_rating: 3.8 },
  { id: 3, host: 'cubecraft.net', port: 25565, icon: null, avg_rating: 4.1 },
];

const MOCK_SAVED = [
  { id: 1, host: 'hypixel.net', port: 25565, icon: null, avg_rating: 4.5 },
];

beforeEach(() => {
  isLoggedIn.set(false);
  userID.set('');
  vi.clearAllMocks();
  vi.useFakeTimers();

  // Default: return all servers from servers_with_rating
  vi.mocked(supabase.from).mockImplementation((table: string) => {
    if (table === 'servers_with_rating') {
      return {
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            range: vi.fn().mockResolvedValue({ data: MOCK_SERVERS, error: null }),
          }),
        }),
      } as any;
    }
    if (table === 'saved_servers_with_rating') {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: MOCK_SAVED, error: null }),
        }),
      } as any;
    }
    return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ data: [], error: null }) } as any;
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('User story: User can browse servers', () => {
  it('renders the explore page with heading and search input', async () => {
    render(Explore);
    expect(screen.getByText(/browse through popular minecraft servers/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search for a server/i)).toBeInTheDocument();

    // Advance past the 400ms loading delay
    await vi.advanceTimersByTimeAsync(500);
  });

  it('does not show "View Saved" button when not logged in', async () => {
    render(Explore);
    await vi.advanceTimersByTimeAsync(500);

    expect(screen.queryByText(/view saved/i)).not.toBeInTheDocument();
  });

  it('shows "View Saved" button when logged in', async () => {
    isLoggedIn.set(true);
    userID.set('uid-123');

    render(Explore);
    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => {
      expect(screen.getByText(/view saved/i)).toBeInTheDocument();
    });
  });

  it('filters servers based on search query', async () => {
    render(Explore);
    await vi.advanceTimersByTimeAsync(500);

    const searchInput = screen.getByPlaceholderText(/search for a server/i);
    await fireEvent.input(searchInput, { target: { value: 'hypixel' } });

    await waitFor(() => {
      // hypixel.net should match, others should not
      expect(screen.getByText('hypixel.net')).toBeInTheDocument();
      expect(screen.queryByText('mineplex.com')).not.toBeInTheDocument();
    });
  });

  it('shows "no servers found" message for unmatched search', async () => {
    render(Explore);
    await vi.advanceTimersByTimeAsync(500);

    const searchInput = screen.getByPlaceholderText(/search for a server/i);
    await fireEvent.input(searchInput, { target: { value: 'zzzznonexistent' } });

    await waitFor(() => {
      expect(screen.getByText(/no servers found/i)).toBeInTheDocument();
    });
  });

  it('loads server data from supabase on mount', async () => {
    render(Explore);
    await vi.advanceTimersByTimeAsync(500);

    expect(supabase.from).toHaveBeenCalledWith('servers_with_rating');
  });
});
