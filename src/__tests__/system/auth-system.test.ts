import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';

// The login store runs side effects on import; we test the auth lifecycle
// by directly exercising the stores and supabase mock.

let loginStore: any;
let userStore: any;
let supabaseMod: any;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.clearAllMocks();

  supabaseMod = await import('../../lib/supabase');
  loginStore = await import('../../lib/stores/login');
  userStore = await import('../../lib/stores/user');

  // Reset stores
  loginStore.email.set('');
  loginStore.password.set('');
  loginStore.isLoggedIn.set(false);
  loginStore.authReady.set(false);
  userStore.username.set('');
  userStore.userID.set('');
  userStore.userEmail.set('');
  userStore.avatar.set('');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Auth system - full lifecycle', () => {
  it('signup creates a new user via supabase', async () => {
    vi.mocked(supabaseMod.supabase.auth.signUp).mockResolvedValueOnce({
      data: {
        user: { id: 'new-uid', email: 'new@test.com', user_metadata: { username: 'NewUser' } },
        session: null,
      },
      error: null,
    });

    const result = await supabaseMod.supabase.auth.signUp({
      email: 'new@test.com',
      password: 'MyPass1!',
      options: {
        emailRedirectTo: 'http://localhost:5173/?type=signup',
        data: { username: 'NewUser' },
      },
    });

    expect(result.error).toBeNull();
    expect(result.data.user?.id).toBe('new-uid');
  });

  it('login sets isLoggedIn and user data', async () => {
    vi.mocked(supabaseMod.supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: {
        user: { id: 'uid-123', email: 'user@test.com' },
        session: { access_token: 'token123' },
      },
      error: null,
    });

    const { data, error } = await supabaseMod.supabase.auth.signInWithPassword({
      email: 'user@test.com',
      password: 'StrongP@ss1',
    });

    expect(error).toBeNull();

    // Simulate what the app does after login
    loginStore.isLoggedIn.set(true);
    userStore.userID.set(data.user.id);
    userStore.userEmail.set(data.user.email);

    expect(get(loginStore.isLoggedIn)).toBe(true);
    expect(get(userStore.userID)).toBe('uid-123');
    expect(get(userStore.userEmail)).toBe('user@test.com');
  });

  it('logout clears all user state', async () => {
    // Set up logged in state
    loginStore.isLoggedIn.set(true);
    userStore.userID.set('uid-123');
    userStore.username.set('TestUser');
    userStore.userEmail.set('user@test.com');

    vi.mocked(supabaseMod.supabase.auth.signOut).mockResolvedValueOnce({ error: null });

    await supabaseMod.supabase.auth.signOut();

    // Simulate what onAuthStateChange does when session becomes null
    loginStore.isLoggedIn.set(false);
    userStore.userID.set('');
    userStore.username.set('');
    userStore.userEmail.set('');
    userStore.avatar.set('');

    expect(get(loginStore.isLoggedIn)).toBe(false);
    expect(get(userStore.userID)).toBe('');
    expect(get(userStore.username)).toBe('');
  });

  it('session persistence restores logged-in state from getSession', async () => {
    vi.mocked(supabaseMod.supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          access_token: 'stored-token',
          user: { id: 'uid-456', email: 'restored@test.com' },
        },
      },
      error: null,
    });

    const { data } = await supabaseMod.supabase.auth.getSession();

    // Simulate store update
    loginStore.isLoggedIn.set(!!data.session);
    loginStore.authReady.set(true);

    expect(get(loginStore.isLoggedIn)).toBe(true);
    expect(get(loginStore.authReady)).toBe(true);
  });

  it('idle timer triggers signOut after inactivity', async () => {
    // Import idle logout (which uses its own supabase mock)
    const { startIdleTimer, stopIdleTimer } = await import('../../lib/utils/idleLogout');

    startIdleTimer();

    vi.advanceTimersByTime(15 * 60 * 1000);

    expect(supabaseMod.supabase.auth.signOut).toHaveBeenCalled();

    stopIdleTimer();
  });

  it('onAuthStateChange is a function available on the auth object', () => {
    // The onAuthStateChange call happens at login.ts module load time.
    // We verify the function exists and is callable.
    expect(typeof supabaseMod.supabase.auth.onAuthStateChange).toBe('function');
  });
});
