import { writable, derived } from 'svelte/store';
import type { ServerData } from '../types/serverInfo';

export const serverData = writable<ServerData | null>(null);
export const serverIp = writable('');
//servernexus8.minehut.gg
export const serverPort = writable('');
//25565
export const error = writable<string | null>(null);

export const ipOK = derived(serverIp, $i => /^[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+$/.test($i) && $i.length >= 7 && $i.length <= 15);
export const portOK = derived(serverPort, $p => /^[0-9]+$/.test($p) && $p.length <= 5);

export const canFetchServerData = derived(
    [ipOK, portOK],
    ([$i, $p]) => $i && $p
);
