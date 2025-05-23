import { writable } from 'svelte/store';
import type { ServerProfile } from '../types/serverInfo';

export const privateProfiles = writable(false);

export const onProfile = writable(false);

export const publicProfile = writable(false);

export const serverProfile = writable<ServerProfile | null>(null);