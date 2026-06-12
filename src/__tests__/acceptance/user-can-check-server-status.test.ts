import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Status from '../../lib/pages/features/Status.svelte';
import { serverIp, serverPort, serverData, error } from '../../lib/stores/server';
import { isLoggedIn } from '../../lib/stores/login';

beforeEach(() => {
  serverIp.set('');
  serverPort.set(25565);
  serverData.set(null);
  error.set(null);
  isLoggedIn.set(false);
  vi.restoreAllMocks();
});

describe('User story: User can check server status', () => {
  it('shows the status page with IP and port inputs', () => {
    render(Status);
    expect(screen.getByText(/fetch the data of any minecraft server/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('hypixel.net')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('25565')).toBeInTheDocument();
  });

  it('fetch button is disabled until IP is valid', async () => {
    render(Status);
    const button = screen.getByRole('button', { name: /fetch server data/i });
    expect(button).toBeDisabled();

    await fireEvent.input(screen.getByPlaceholderText('hypixel.net'), {
      target: { value: 'hypixel.net' },
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('fetches server data and displays status cards', async () => {
    const mockData = {
      online: true,
      host: 'hypixel.net',
      port: 25565,
      ip_address: '172.65.238.142',
      icon: null,
      eula_blocked: false,
      software: 'Spigot',
      version: { name_raw: '1.20.4', name_clean: '1.20.4', name_html: '1.20.4', protocol: 765 },
      players: { online: 45000, max: 100000 },
      motd: { raw: 'Welcome', clean: 'Welcome', html: 'Welcome' },
      srv_record: { host: 'mc.hypixel.net', port: 25565 },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    render(Status);

    await fireEvent.input(screen.getByPlaceholderText('hypixel.net'), {
      target: { value: 'hypixel.net' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /fetch server data/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /fetch server data/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.mcstatus.io/v2/status/java/hypixel.net:25565'
      );
    });
  });

  it('shows error message when server is invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    render(Status);

    await fireEvent.input(screen.getByPlaceholderText('hypixel.net'), {
      target: { value: 'invalid.server.xyz' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /fetch server data/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /fetch server data/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch server data/i)).toBeInTheDocument();
    });
  });

  it('shows loading skeletons while fetching', async () => {
    // Make fetch hang so we can observe loading state
    let resolvePromise: (value: any) => void;
    const fetchPromise = new Promise((resolve) => { resolvePromise = resolve; });

    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(fetchPromise as any);

    render(Status);

    await fireEvent.input(screen.getByPlaceholderText('hypixel.net'), {
      target: { value: 'hypixel.net' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /fetch server data/i })).not.toBeDisabled();
    });

    await fireEvent.click(screen.getByRole('button', { name: /fetch server data/i }));

    await waitFor(() => {
      expect(screen.getByText(/fetching/i)).toBeInTheDocument();
    });

    // Clean up
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ online: true, host: 'hypixel.net', port: 25565, ip_address: '1.2.3.4', version: { name_raw: '', name_clean: '', name_html: '', protocol: 0 }, players: { online: 0, max: 0 }, srv_record: { host: 'a', port: 1 } }),
    });
  });
});
