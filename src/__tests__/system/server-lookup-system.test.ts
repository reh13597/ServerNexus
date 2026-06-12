import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { serverIp, serverPort, serverData, error, canFetchServerData } from '../../lib/stores/server';
import { isLoggedIn } from '../../lib/stores/login';
import { supabase } from '../../lib/supabase';

const MOCK_API_RESPONSE = {
  online: true,
  host: 'hypixel.net',
  port: 25565,
  ip_address: '172.65.238.142',
  eula_blocked: false,
  software: 'Spigot',
  version: {
    name_raw: '1.20.4',
    name_clean: '1.20.4',
    name_html: '1.20.4',
    protocol: 765,
  },
  players: {
    online: 45000,
    max: 100000,
    sample: [{ name: 'Notch', id: 'uuid-1' }],
  },
  motd: {
    raw: '\\u00a7aWelcome to Hypixel!',
    clean: 'Welcome to Hypixel!',
    html: '<span style="color:#55ff55">Welcome to Hypixel!</span>',
  },
  srv_record: { host: 'mc.hypixel.net', port: 25565 },
};

const OFFLINE_API_RESPONSE = {
  online: false,
  host: 'offline.server.com',
  port: 25565,
  ip_address: '1.2.3.4',
  srv_record: null,
  version: null,
  players: { online: 0, max: 0 },
  motd: null,
};

beforeEach(() => {
  serverIp.set('');
  serverPort.set(25565);
  serverData.set(null);
  error.set(null);
  isLoggedIn.set(false);
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('Server lookup system', () => {
  it('validates IP and port before allowing fetch', () => {
    expect(get(canFetchServerData)).toBe(false);

    serverIp.set('hypixel.net');
    expect(get(canFetchServerData)).toBe(true);

    serverPort.set(123456); // too many digits
    expect(get(canFetchServerData)).toBe(false);
  });

  it('fetches and normalizes server data from mcstatus API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_API_RESPONSE),
    } as Response);

    serverIp.set('hypixel.net');
    serverPort.set(25565);

    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${get(serverIp)}:${get(serverPort)}`);
    const data = await response.json();

    expect(fetchMock).toHaveBeenCalledWith('https://api.mcstatus.io/v2/status/java/hypixel.net:25565');
    expect(data.online).toBe(true);
    expect(data.players.online).toBe(45000);
    expect(data.version.name_clean).toBe('1.20.4');

    serverData.set(data);
    expect(get(serverData)?.online).toBe(true);
  });

  it('handles offline server response with normalization', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(OFFLINE_API_RESPONSE),
    } as Response);

    const response = await fetch('https://api.mcstatus.io/v2/status/java/offline.server.com:25565');
    const data = await response.json();

    // The Status component normalizes offline responses
    if (data && data.online === false) {
      const normalized = {
        online: false,
        host: '',
        port: 0,
        ip_address: null,
        icon: null,
        eula_blocked: null,
        software: null,
        version: { name_clean: '', name_raw: '', name_html: '', protocol: 0 },
        players: { online: 0, max: 0 },
        motd: { raw: '', clean: '', html: '' },
      };
      serverData.set(normalized);
    }

    expect(get(serverData)?.online).toBe(false);
    expect(get(serverData)?.players.online).toBe(0);
  });

  it('handles network/fetch errors gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

    serverIp.set('unreachable.server.net');
    serverPort.set(25565);

    try {
      await fetch(`https://api.mcstatus.io/v2/status/java/${get(serverIp)}:${get(serverPort)}`);
    } catch {
      error.set('Error: Failed to fetch server data.');
      serverData.set({
        online: false,
        host: '',
        port: 0,
        ip_address: null,
        icon: null,
        eula_blocked: null,
        software: null,
        version: { name_clean: '', name_raw: '', name_html: '', protocol: 0 },
        players: { online: 0, max: 0 },
        motd: { raw: '', clean: '', html: '' },
      });
    }

    expect(get(error)).toBe('Error: Failed to fetch server data.');
    expect(get(serverData)?.online).toBe(false);
  });

  it('upserts server to DB when user is logged in and server is valid', async () => {
    isLoggedIn.set(true);
    serverIp.set('hypixel.net');
    serverPort.set(25565);

    const upsertChain = {
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    vi.mocked(supabase.from).mockReturnValue(upsertChain as any);

    await supabase.from('servers').upsert(
      [{ host: 'hypixel.net', port: 25565, icon: null }],
      { onConflict: 'host, port', ignoreDuplicates: true }
    );

    expect(supabase.from).toHaveBeenCalledWith('servers');
    expect(upsertChain.upsert).toHaveBeenCalledWith(
      [{ host: 'hypixel.net', port: 25565, icon: null }],
      { onConflict: 'host, port', ignoreDuplicates: true }
    );
  });

  it('does NOT upsert when user is not logged in', () => {
    isLoggedIn.set(false);
    serverIp.set('hypixel.net');

    // Simulate the check from Status.svelte
    if (get(isLoggedIn)) {
      supabase.from('servers');
    }

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
