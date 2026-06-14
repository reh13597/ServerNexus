import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { ServerData } from '../types/serverInfo';

interface ServerStores {
	data: Writable<ServerData | null>;
	ip: Writable<string>;
	port: Writable<number>;
	error: Writable<string | null>;
	ipOK: Readable<boolean>;
	portOK: Readable<boolean>;
	canFetch: Readable<boolean>;
}

function createServerStores(): ServerStores {
	const data = writable<ServerData | null>(null);
	const ip = writable('');
	const port = writable(25565);
	const error = writable<string | null>(null);

	const ipOK = derived(ip, ($ip) =>
		/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test($ip) && $ip.length >= 7 && $ip.length <= 30
	);
	const portOK = derived(port, ($port) =>
		/^[0-9]+$/.test($port.toString()) && $port.toString().length <= 5
	);
	const canFetch = derived([ipOK, portOK], ([$i, $p]) => $i && $p);

	return { data, ip, port, error, ipOK, portOK, canFetch };
}

// Primary server stores
const primary = createServerStores();
export const serverData = primary.data;
export const serverIp = primary.ip;
export const serverPort = primary.port;
export const error = primary.error;
export const ipOK = primary.ipOK;
export const portOK = primary.portOK;
export const canFetchServerData = primary.canFetch;

// Profile server stores
const profile = createServerStores();
export const profileServerData = profile.data;
export const profileServerIp = profile.ip;
export const profileServerPort = profile.port;
export const profileError = profile.error;
export const profileIpOK = profile.ipOK;
export const profilePortOK = profile.portOK;
export const profileCanFetchServerData = profile.canFetch;
