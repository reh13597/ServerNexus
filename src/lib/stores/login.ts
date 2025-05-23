import { writable, derived } from 'svelte/store';
import { supabase } from '../supabase';

export const email = writable('');
export const password = writable('');

export const emailOK = derived(email, $e => /^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test($e));
export const passOK = derived(password, $p => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test($p));

export const canLogin = derived(
  [emailOK, passOK],
  ([$e, $p]) => $e && $p
);

export const isLoggedIn = writable(false);
export const authReady = writable(false);

/* supabase.auth.getSession().then(({ data: { session } }) => {
  isLoggedIn.set(!!session);
  if (session) {
    authReady.set(true);
  }
});

supabase.auth.onAuthStateChange((_event, session) => {
  isLoggedIn.set(!!session);
  authReady.set(true);
});
 */
