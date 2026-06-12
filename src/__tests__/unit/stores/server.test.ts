import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  serverIp, serverPort, ipOK, portOK, canFetchServerData,
  profileServerIp, profileServerPort, profileIpOK, profilePortOK, profileCanFetchServerData,
} from '../../../lib/stores/server';

beforeEach(() => {
  serverIp.set('');
  serverPort.set(25565);
  profileServerIp.set('');
  profileServerPort.set(25565);
});

describe('server store - ipOK', () => {
  it('should be false for an empty string', () => {
    expect(get(ipOK)).toBe(false);
  });

  it('should be true for a valid domain like hypixel.net', () => {
    serverIp.set('hypixel.net');
    expect(get(ipOK)).toBe(true);
  });

  it('should be true for a subdomain', () => {
    serverIp.set('play.example.com');
    expect(get(ipOK)).toBe(true);
  });

  it('should be true for an IP-like address', () => {
    serverIp.set('192.168.1.1');
    expect(get(ipOK)).toBe(true);
  });

  it('should be false for a single word without dot', () => {
    serverIp.set('localhost');
    expect(get(ipOK)).toBe(false);
  });

  it('should be false for strings shorter than 7 characters', () => {
    serverIp.set('a.b.co');
    expect(get(ipOK)).toBe(false);
  });

  it('should be false for strings longer than 30 characters', () => {
    serverIp.set('a'.repeat(27) + '.com');
    expect(get(ipOK)).toBe(false);
  });

  it('should accept hyphens in domain parts', () => {
    serverIp.set('my-server.example.com');
    expect(get(ipOK)).toBe(true);
  });
});

describe('server store - portOK', () => {
  it('should be true for default port 25565', () => {
    expect(get(portOK)).toBe(true);
  });

  it('should be true for port 1', () => {
    serverPort.set(1);
    expect(get(portOK)).toBe(true);
  });

  it('should be true for port 99999 (5 digits)', () => {
    serverPort.set(99999);
    expect(get(portOK)).toBe(true);
  });

  it('should be false for port with more than 5 digits', () => {
    serverPort.set(100000);
    expect(get(portOK)).toBe(false);
  });

  it('should be true for port 0', () => {
    serverPort.set(0);
    expect(get(portOK)).toBe(true);
  });
});

describe('server store - canFetchServerData', () => {
  it('should be false when IP is empty and port is default', () => {
    expect(get(canFetchServerData)).toBe(false);
  });

  it('should be true when both IP and port are valid', () => {
    serverIp.set('hypixel.net');
    serverPort.set(25565);
    expect(get(canFetchServerData)).toBe(true);
  });

  it('should be false when IP is invalid but port is valid', () => {
    serverIp.set('bad');
    serverPort.set(25565);
    expect(get(canFetchServerData)).toBe(false);
  });

  it('should be false when IP is valid but port is invalid', () => {
    serverIp.set('hypixel.net');
    serverPort.set(123456);
    expect(get(canFetchServerData)).toBe(false);
  });
});

describe('server store - profile variants', () => {
  it('profileIpOK should validate profile server IP', () => {
    profileServerIp.set('play.example.com');
    expect(get(profileIpOK)).toBe(true);
  });

  it('profilePortOK should validate profile server port', () => {
    profileServerPort.set(25565);
    expect(get(profilePortOK)).toBe(true);
  });

  it('profileCanFetchServerData should require both valid', () => {
    profileServerIp.set('play.example.com');
    profileServerPort.set(25565);
    expect(get(profileCanFetchServerData)).toBe(true);
  });

  it('profileCanFetchServerData should be false when IP is empty', () => {
    expect(get(profileCanFetchServerData)).toBe(false);
  });
});
