import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Signup from '../../lib/pages/Signup.svelte';
import { supabase } from '../../lib/supabase';
import { email, username, password } from '../../lib/stores/signup';

beforeEach(() => {
  email.set('');
  username.set('');
  password.set('');
  vi.clearAllMocks();
});

describe('Regression: signup isLoading gets stuck on error (bug #5)', () => {
  it('isLoading stays true when signup fails because error path lacks isLoading=false', async () => {
    // This test documents the BUG: in Signup.svelte, the error path does
    //   if (error) { console.log(...); return; }
    // without setting isLoading = false first. So the button stays on "Signing Up..."

    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'User already registered', name: 'AuthApiError', status: 422 },
    } as any);

    render(Signup);

    // Fill form
    await fireEvent.input(screen.getByPlaceholderText('herobrine@nether.com'), {
      target: { value: 'existing@test.com' },
    });
    await fireEvent.input(screen.getByPlaceholderText('herobrine_goat_666'), {
      target: { value: 'existuser' },
    });
    await fireEvent.input(screen.getByPlaceholderText('Ihatesteve123$'), {
      target: { value: 'MyPass1!' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
    });

    // BUG: The button should be re-enabled after error, but it shows "Signing Up..."
    // because isLoading is never reset to false
    await waitFor(() => {
      expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    });

    // When the bug is fixed, the test below would pass instead:
    // expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});
