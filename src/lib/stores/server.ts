import { writable, derived } from 'svelte/store';
import type { ServerData } from '../types/serverInfo';

export const serverData = writable<ServerData | null>(null);
export const serverIp = writable('');
export const error = writable<string | null>(null);

export const ipOK = derived(serverIp, $i => /^[A-Za-z0-9.]+[A-Za-z0-9.]+[A-Za-z0-9.]+\.[A-Za-z0-9]+$/.test($i) && $i.length >= 7 && $i.length <= 30);

export const canFetchServerData = derived(
    [ipOK],
    ([$i]) => $i
);
