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

async function fillValidForm() {
  const emailInput = screen.getByPlaceholderText('herobrine@nether.com');
  const userInput = screen.getByPlaceholderText('herobrine_goat_666');
  const passInput = screen.getByPlaceholderText('Ihatesteve123$');

  await fireEvent.input(emailInput, { target: { value: 'newuser@test.com' } });
  await fireEvent.input(userInput, { target: { value: 'testuser' } });
  await fireEvent.input(passInput, { target: { value: 'MyPass1!' } });
}

describe('Signup page integration', () => {
  it('renders the signup form', () => {
    render(Signup);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('herobrine@nether.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('herobrine_goat_666')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ihatesteve123$')).toBeInTheDocument();
  });

  it('signup button is disabled when form is incomplete', () => {
    render(Signup);
    const button = screen.getByRole('button', { name: /sign up/i });
    expect(button).toBeDisabled();
  });

  it('signup button becomes enabled with all valid fields', async () => {
    render(Signup);
    await fillValidForm();

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /sign up/i });
      expect(button).not.toBeDisabled();
    });
  });

  it('calls supabase.auth.signUp on submission', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: { id: 'new-uid' }, session: null },
      error: null,
    } as any);

    render(Signup);
    await fillValidForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'newuser@test.com',
          password: 'MyPass1!',
        })
      );
    });
  });

  it('opens the confirmation modal on successful signup', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: { id: 'new-uid' }, session: null },
      error: null,
    } as any);

    render(Signup);
    await fillValidForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });
  });

  it('does NOT reset isLoading on signup error (known bug)', async () => {
    // This documents the existing bug: when signUp errors, isLoading stays true
    // because the error return path does not set isLoading = false
    vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'User already registered', name: 'AuthError', status: 422 },
    } as any);

    render(Signup);
    await fillValidForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // After the error, the button text should be stuck on "Signing Up..."
    // because isLoading is never reset to false in the error path
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
      // The button should show loading text because of the bug
      expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    });
  });
});
