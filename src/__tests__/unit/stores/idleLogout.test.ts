import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to mock supabase before importing idleLogout
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

import { startIdleTimer, stopIdleTimer } from '../../../lib/utils/idleLogout';
import { supabase } from '../../../lib/supabase';

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  stopIdleTimer();
  vi.useRealTimers();
});

describe('idleLogout', () => {
  it('should register event listeners when startIdleTimer is called', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    startIdleTimer();

    const expectedEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    for (const evt of expectedEvents) {
      expect(addSpy).toHaveBeenCalledWith(evt, expect.any(Function));
    }
  });

  it('should call supabase.auth.signOut after 15 minutes of inactivity', () => {
    startIdleTimer();

    // Advance time by 15 minutes (IDLE_TIME = 15 * 60 * 1000)
    vi.advanceTimersByTime(IDLE_TIME);

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should NOT call signOut before 15 minutes', () => {
    startIdleTimer();

    vi.advanceTimersByTime(IDLE_TIME - 1);

    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('should reset the timer on user activity', () => {
    startIdleTimer();

    // Advance halfway
    vi.advanceTimersByTime(IDLE_TIME / 2);

    // Simulate user activity
    window.dispatchEvent(new Event('mousemove'));

    // Advance another half -- should NOT sign out because timer was reset
    vi.advanceTimersByTime(IDLE_TIME / 2);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();

    // Advance the remaining half to complete the full duration from the reset
    vi.advanceTimersByTime(IDLE_TIME / 2);
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should remove event listeners when stopIdleTimer is called', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    startIdleTimer();
    stopIdleTimer();

    const expectedEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    for (const evt of expectedEvents) {
      expect(removeSpy).toHaveBeenCalledWith(evt, expect.any(Function));
    }
  });

  it('should not sign out after stopIdleTimer clears the timeout', () => {
    startIdleTimer();
    stopIdleTimer();

    vi.advanceTimersByTime(IDLE_TIME * 2);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('should handle multiple activity events resetting the timer each time', () => {
    startIdleTimer();

    // Activity at various points, then wait full duration from last activity
    vi.advanceTimersByTime(20_000);
    window.dispatchEvent(new Event('keydown'));

    vi.advanceTimersByTime(20_000);
    window.dispatchEvent(new Event('click'));

    vi.advanceTimersByTime(IDLE_TIME - 1);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
