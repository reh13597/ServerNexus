import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Login from '../../lib/pages/Login.svelte';
import { supabase } from '../../lib/supabase';
import { email, password, isLoggedIn } from '../../lib/stores/login';
import { get } from 'svelte/store';

beforeEach(() => {
  email.set('');
  password.set('');
  isLoggedIn.set(false);
  vi.clearAllMocks();
});

describe('Login page integration', () => {
  it('renders the login form', () => {
    render(Login);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('herobrine@nether.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ihatesteve123$')).toBeInTheDocument();
  });

  it('login button is disabled when form is invalid', () => {
    render(Login);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeDisabled();
  });

  it('login button becomes enabled when email and password are valid', async () => {
    render(Login);

    const emailInput = screen.getByPlaceholderText('herobrine@nether.com');
    const passInput = screen.getByPlaceholderText('Ihatesteve123$');

    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.input(passInput, { target: { value: 'StrongP@ss1' } });

    // Wait for derived stores to update
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /login/i });
      expect(button).not.toBeDisabled();
    });
  });

  it('shows error message on failed login', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials', name: 'AuthError', status: 400 },
    } as any);

    render(Login);

    const emailInput = screen.getByPlaceholderText('herobrine@nether.com');
    const passInput = screen.getByPlaceholderText('Ihatesteve123$');

    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.input(passInput, { target: { value: 'StrongP@ss1' } });

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /login/i });
      expect(button).not.toBeDisabled();
    });

    const button = screen.getByRole('button', { name: /login/i });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('calls supabase signInWithPassword on form submission', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: { id: 'uid-123' }, session: {} },
      error: null,
    } as any);

    render(Login);

    const emailInput = screen.getByPlaceholderText('herobrine@nether.com');
    const passInput = screen.getByPlaceholderText('Ihatesteve123$');

    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.input(passInput, { target: { value: 'StrongP@ss1' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'StrongP@ss1',
      });
    });
  });

  it('clears email and password on error', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Bad creds', name: 'AuthError', status: 400 },
    } as any);

    render(Login);

    const emailInput = screen.getByPlaceholderText('herobrine@nether.com');
    const passInput = screen.getByPlaceholderText('Ihatesteve123$');

    await fireEvent.input(emailInput, { target: { value: 'user@example.com' } });
    await fireEvent.input(passInput, { target: { value: 'StrongP@ss1' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(get(email)).toBe('');
      expect(get(password)).toBe('');
    });
  });
});
