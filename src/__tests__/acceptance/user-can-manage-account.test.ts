import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Account from '../../lib/pages/Account.svelte';
import { supabase } from '../../lib/supabase';
import { userID, userEmail, username, avatar } from '../../lib/stores/user';
import { isLoggedIn } from '../../lib/stores/login';

function mockProfileFetch() {
  vi.mocked(supabase.from).mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        username: 'TestUser',
        is_public: false,
        created_at: '2024-01-15T00:00:00Z',
        avatar: '',
      },
      error: null,
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  } as any);
}

beforeEach(() => {
  userID.set('uid-123');
  userEmail.set('user@test.com');
  username.set('TestUser');
  avatar.set('');
  isLoggedIn.set(true);
  vi.clearAllMocks();
  mockProfileFetch();
});

describe('User story: User can manage account', () => {
  it('shows current username and email', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });
  });

  it('shows member since date after profile fetch', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });
  });

  it('can enter and exit edit mode', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText(/edit information/i));
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });
  });

  it('can edit username in edit mode', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText(/edit information/i));

    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter username');
      expect(input).toBeInTheDocument();
      expect((input as HTMLInputElement).value).toBe('TestUser');
    });

    const input = screen.getByPlaceholderText('Enter username');
    await fireEvent.input(input, { target: { value: 'NewUsername' } });
    expect((input as HTMLInputElement).value).toBe('NewUsername');
  });

  it('shows password fields in edit mode', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText(/edit information/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
    });
  });

  it('shows password as masked text when not editing', async () => {
    render(Account);
    await waitFor(() => {
      // The password display shows bullet characters
      const passwordDisplay = screen.getByText(/•/);
      expect(passwordDisplay).toBeInTheDocument();
    });
  });

  it('shows visibility toggle in edit mode', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText(/edit information/i));

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Private')).toBeInTheDocument();
    });
  });

  it('shows avatar input and preview button in edit mode', async () => {
    render(Account);
    await waitFor(() => {
      expect(screen.getByText(/edit information/i)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByText(/edit information/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. Notch')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });
  });
});
