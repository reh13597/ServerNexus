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
  avg_rating: 4.2,
  review_count: 3,
  save_count: 7,
};

function mockFromChain(data: any = null, error: any = null) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    // When called without .single(), resolve directly
    then: vi.fn((cb: any) => cb({ data: data ? [data] : [], error })),
  };
  return chain;
}

beforeEach(() => {
  isLoggedIn.set(true);
  userID.set('user-abc');
  username.set('TestPlayer');
  vi.clearAllMocks();

  // Mock the reviews query to return sample reviews
  const reviewsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          user_id: 'other-user',
          server_id: 42,
          rating: 5,
          review: 'Great server with amazing community!',
          profiles: { username: 'OtherUser', avatar: null },
        },
      ],
      error: null,
    }),
  };
  vi.mocked(supabase.from).mockReturnValue(reviewsChain as any);
});

describe('ReviewPanel integration', () => {
  it('renders the server host and stats', () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByText('test.server.com')).toBeInTheDocument();
    expect(screen.getByText('4.2 Average')).toBeInTheDocument();
    expect(screen.getByText('3 Reviews')).toBeInTheDocument();
    expect(screen.getByText('7 Saves')).toBeInTheDocument();
  });

  it('shows review form when logged in', () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByText(/rate & review/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your review/i)).toBeInTheDocument();
  });

  it('shows login prompt when not logged in', () => {
    isLoggedIn.set(false);
    render(ReviewPanel, { props: { profile: mockProfile } });
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/write your review/i)).not.toBeInTheDocument();
  });

  it('submit button is disabled when form is invalid', () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    const submitBtn = screen.getByRole('button', { name: /submit review/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows character counter when review text is too short', async () => {
    render(ReviewPanel, { props: { profile: mockProfile } });
    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, { target: { value: 'Short' } });

    await waitFor(() => {
      expect(screen.getByText(/35 more characters required/i)).toBeInTheDocument();
    });
  });

  it('enables submit when rating is selected and review is long enough', async () => {
    render(ReviewPanel, { props: { profile: mockProfile } });

    // Select a star rating
    const stars = screen.getAllByRole('radio');
    await fireEvent.click(stars[2]); // 3rd star

    // Type long enough review
    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, {
      target: { value: 'This is a detailed review that is at least forty characters long!' },
    });

    await waitFor(() => {
      const submitBtn = screen.getByRole('button', { name: /submit review/i });
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it('calls supabase insert on review submission', async () => {
    const insertChain = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'reviews') {
        return insertChain as any;
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ data: [], error: null }) } as any;
    });

    render(ReviewPanel, { props: { profile: mockProfile } });

    const stars = screen.getAllByRole('radio');
    await fireEvent.click(stars[3]); // 4th star

    const textarea = screen.getByPlaceholderText(/write your review/i);
    await fireEvent.input(textarea, {
      target: { value: 'This is an excellent review with more than forty characters total!' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit review/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /submit review/i }));

    await waitFor(() => {
      expect(insertChain.insert).toHaveBeenCalled();
    });
  });
});
