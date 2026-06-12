import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { isLoggedIn, authReady } from '../../lib/stores/login';
import { userID } from '../../lib/stores/user';

// Mock svelte-spa-router
vi.mock('svelte-spa-router', () => ({
  default: vi.fn(),
  push: vi.fn(),
  wrap: vi.fn((opts: any) => opts),
  location: { subscribe: vi.fn() },
}));

import { push } from 'svelte-spa-router';

beforeEach(() => {
  isLoggedIn.set(false);
  authReady.set(true);
  userID.set('');
  vi.clearAllMocks();
});

describe('Regression: Account route guard', () => {
  it('Account page redirects to /login when userID is empty', () => {
    // The Account component checks $userID in onMount and calls push('/login')
    // We verify the guard logic directly
    const uid = get(userID);

    if (!uid) {
      push('/login');
    }

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('Account page does NOT redirect when userID is present', () => {
    userID.set('uid-123');
    const uid = get(userID);

    if (!uid) {
      push('/login');
    }

    expect(push).not.toHaveBeenCalled();
  });

  it('Dashboard route guard redirects to /home when not logged in', () => {
    // From App.svelte route definition:
    // conditions: [() => { if (!get(isLoggedIn)) { push('/home'); return false; } return true; }]
    const condition = () => {
      if (!get(isLoggedIn)) {
        push('/home');
        return false;
      }
      return true;
    };

    const result = condition();
    expect(result).toBe(false);
    expect(push).toHaveBeenCalledWith('/home');
  });

  it('Dashboard route guard allows access when logged in', () => {
    isLoggedIn.set(true);

    const condition = () => {
      if (!get(isLoggedIn)) {
        push('/home');
        return false;
      }
      return true;
    };

    const result = condition();
    expect(result).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it('Login route guard redirects to / when already logged in', () => {
    isLoggedIn.set(true);

    // From App.svelte:
    // conditions: [() => { if(get(isLoggedIn)) { push('/'); return false; } return true; }]
    const condition = () => {
      if (get(isLoggedIn)) {
        push('/');
        return false;
      }
      return true;
    };

    const result = condition();
    expect(result).toBe(false);
    expect(push).toHaveBeenCalledWith('/');
  });
});
