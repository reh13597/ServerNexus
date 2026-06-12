import { describe, it, expect } from 'vitest';
import { supabase } from '../../lib/supabase';

describe('Smoke: Supabase client', () => {
  it('supabase client is defined', () => {
    expect(supabase).toBeDefined();
  });

  it('supabase.auth is available', () => {
    expect(supabase.auth).toBeDefined();
  });

  it('supabase.auth.getSession is a function', () => {
    expect(typeof supabase.auth.getSession).toBe('function');
  });

  it('supabase.auth.signInWithPassword is a function', () => {
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
  });

  it('supabase.auth.signUp is a function', () => {
    expect(typeof supabase.auth.signUp).toBe('function');
  });

  it('supabase.auth.signOut is a function', () => {
    expect(typeof supabase.auth.signOut).toBe('function');
  });

  it('supabase.from is a function', () => {
    expect(typeof supabase.from).toBe('function');
  });

  it('supabase.channel is a function', () => {
    expect(typeof supabase.channel).toBe('function');
  });
});
