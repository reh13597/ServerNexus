import { writable } from 'svelte/store';
import type { ServerData } from '../types/serverInfo';

export const serverData = writable<ServerData | null>(null);
export const serverIp = writable('servernexus8.minehut.gg');
export const serverPort = writable(25565);
export const error = writable<string | null>(null);