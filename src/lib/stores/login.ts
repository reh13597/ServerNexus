import { writable, derived } from 'svelte/store';
import { supabase } from '../supabase';
import { username, userID, userEmail } from './user';

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

async function setUserData(session) {
  if (session?.user) {
    userID.set(session.user.id);
    userEmail.set(session.user.email || '');
    
    // Fetch username from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .maybeSingle();
      
    if (profile?.username) {
      username.set(profile.username);
    } else {
      username.set(session.user.user_metadata?.username || '');
    }
  } else {
    userID.set('');
    username.set('');
    userEmail.set('');
  }
}

// Initialize session
supabase.auth.getSession().then(({ data: { session } }) => {
  isLoggedIn.set(!!session);
  authReady.set(true);
  setUserData(session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  isLoggedIn.set(!!session);
  authReady.set(true);
  setUserData(session);
});

