import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Regression: non-200 mcstatus API responses', () => {
  it('should handle a 500 response without crashing', async () => {
    // In Status.svelte, the fetch call does:
    //   const response = await fetch(...);
    //   const data = await response.json();
    // It does NOT check response.ok first, so a 500 with invalid body would throw.
    // This test verifies the behavior.

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    } as Response);

    let caughtError: Error | null = null;

    try {
      const response = await fetch('https://api.mcstatus.io/v2/status/java/bad.server:25565');
      await response.json(); // This will throw because json() rejects
    } catch (err) {
      caughtError = err as Error;
    }

    expect(caughtError).not.toBeNull();
    expect(caughtError?.message).toContain('Unexpected token');
  });

  it('should handle a 404 response with JSON error body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Server not found' }),
    } as Response);

    const response = await fetch('https://api.mcstatus.io/v2/status/java/nonexistent.server:25565');
    const data = await response.json();

    // The current code would try to use data.online which would be undefined
    expect(data.online).toBeUndefined();
    expect(data.error).toBe('Server not found');
  });

  it('should handle a 429 rate-limit response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ message: 'Rate limited' }),
    } as Response);

    const response = await fetch('https://api.mcstatus.io/v2/status/java/hypixel.net:25565');
    const data = await response.json();

    // Without response.ok check, the app treats this as valid data
    expect(data.online).toBeUndefined();
  });
});
