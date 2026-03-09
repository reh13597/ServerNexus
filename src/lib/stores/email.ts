import { writable } from 'svelte/store';

export const name = writable('');
export const email = writable('');
export const subject = writable('');
export const message = writable('');