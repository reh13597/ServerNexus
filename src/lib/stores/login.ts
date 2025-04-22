import { writable, derived } from 'svelte/store';

export const username = writable('');
export const password = writable('');

export const userOK = derived(username, $u => /[A-Za-z0-9]/.test($u));
export const passOK = derived(password, $p => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test($p));

export const isLoggedIn = derived(
  [userOK, passOK],
  ([$u, $p]) => $u && $p
);
