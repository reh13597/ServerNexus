import { writable, derived } from 'svelte/store';
import type { ServerData } from '../types/serverInfo';

export const serverData = writable<ServerData | null>(null);
export const serverIp = writable('');
export const serverPort = writable(25565);
export const error = writable<string | null>(null);

export const ipOK = derived(serverIp, $i1 => /^[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+$/.test($i1) && $i1.length >= 7 && $i1.length <= 30);
export const portOK = derived(serverPort, $p1 => /^[0-9]+$/.test($p1.toString()) && $p1.toString().length <= 5);

export const canFetchServerData = derived(
    [ipOK, portOK],
    ([$i, $p]) => $i && $p
);

export const profileServerData = writable<ServerData | null>(null);
export const profileServerIp = writable('');
export const profileServerPort = writable(25565);
export const profileError = writable<string | null>(null);

export const profileIpOK = derived(profileServerIp, $i2 => /^[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+$/.test($i2) && $i2.length >= 7 && $i2.length <= 30);
export const profilePortOK = derived(profileServerPort, $p2 => /^[0-9]+$/.test($p2.toString()) && $p2.toString().length <= 5);

export const publicProfile = writable(false);

export const serverID = writable('');

export const profileCanFetchServerData = derived(
    [profileIpOK, profilePortOK],
    ([$i2, $p2]) => $i2 && $p2
);

