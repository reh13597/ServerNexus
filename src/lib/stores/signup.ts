import { writable, derived } from 'svelte/store';

export const email = writable('');
export const username = writable('');
export const password = writable('');

export const emailOK = derived(email, $e => /^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test($e));
export const userOK = derived(username, $u => /[A-Za-z0-9]/.test($u));
export const passOK = derived(password, $p => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test($p));

export const isSignedUp = derived(
  [emailOK, userOK, passOK],
  ([$e, $u, $p]) => $e && $u && $p
);
