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

  it('should call supabase.auth.signOut after 1 minute of inactivity', () => {
    startIdleTimer();

    // Advance time by 60 seconds (IDLE_TIME = 1 * 60 * 1000)
    vi.advanceTimersByTime(60_000);

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('should NOT call signOut before 1 minute', () => {
    startIdleTimer();

    vi.advanceTimersByTime(59_999);

    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('should reset the timer on user activity', () => {
    startIdleTimer();

    // Advance 30 seconds
    vi.advanceTimersByTime(30_000);

    // Simulate user activity
    window.dispatchEvent(new Event('mousemove'));

    // Advance another 30 seconds -- should NOT sign out because timer was reset
    vi.advanceTimersByTime(30_000);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();

    // Advance the remaining 30 seconds to complete the full minute from the reset
    vi.advanceTimersByTime(30_000);
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

    vi.advanceTimersByTime(120_000);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('should handle multiple activity events resetting the timer each time', () => {
    startIdleTimer();

    // Activity at 20s, 40s, then wait full minute from last activity
    vi.advanceTimersByTime(20_000);
    window.dispatchEvent(new Event('keydown'));

    vi.advanceTimersByTime(20_000);
    window.dispatchEvent(new Event('click'));

    vi.advanceTimersByTime(59_999);
    expect(supabase.auth.signOut).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
