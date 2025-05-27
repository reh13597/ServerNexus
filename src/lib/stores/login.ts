import { writable, derived } from 'svelte/store';
import { supabase } from '../supabase';
import { username, userID } from './user';

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

function setUserData(session) {
  if (session?.user) {
    userID.set(session.user.id);
    username.set(session.user.user_metadata?.username);
  } else {
    userID.set('');
    username.set('');
  }
}

supabase.auth.getSession().then(({ data: { session } }) => {
  isLoggedIn.set(!!session);
  setUserData(session);
  authReady.set(true);
});

supabase.auth.onAuthStateChange((_event, session) => {
  isLoggedIn.set(!!session);
  setUserData(session);
  authReady.set(true);
});

