import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';

// We import the signup store's validators because login.ts triggers side-effects
// (supabase.auth.getSession) on import. Instead we test the regex logic directly
// and also import the actual stores after the mock is in place.
let email: any, password: any, emailOK: any, passOK: any, canLogin: any;

beforeEach(async () => {
  // Dynamic import so the supabase mock from setup.ts is active
  const mod = await import('../../../lib/stores/login');
  email = mod.email;
  password = mod.password;
  emailOK = mod.emailOK;
  passOK = mod.passOK;
  canLogin = mod.canLogin;

  // Reset to defaults
  email.set('');
  password.set('');
});

describe('login store - emailOK', () => {
  it('should be false for an empty string', () => {
    email.set('');
    expect(get(emailOK)).toBe(false);
  });

  it('should be true for a valid simple email', () => {
    email.set('user@example.com');
    expect(get(emailOK)).toBe(true);
  });

  it('should be true for email with dots in local part', () => {
    email.set('first.last@domain.com');
    expect(get(emailOK)).toBe(true);
  });

  it('should be true for email with numbers', () => {
    email.set('user123@test456.org');
    expect(get(emailOK)).toBe(true);
  });

  it('should be false for email without @', () => {
    email.set('userexample.com');
    expect(get(emailOK)).toBe(false);
  });

  it('should be false for email without domain extension', () => {
    email.set('user@example');
    expect(get(emailOK)).toBe(false);
  });

  it('should be false for email with spaces', () => {
    email.set('user @example.com');
    expect(get(emailOK)).toBe(false);
  });

  it('should be false for email with special characters in local part', () => {
    email.set('user+tag@example.com');
    expect(get(emailOK)).toBe(false);
  });

  it('should be false for email with double @', () => {
    email.set('user@@example.com');
    expect(get(emailOK)).toBe(false);
  });
});

describe('login store - passOK', () => {
  it('should be false for an empty string', () => {
    password.set('');
    expect(get(passOK)).toBe(false);
  });

  it('should be true for a valid password', () => {
    password.set('StrongP@ss1');
    expect(get(passOK)).toBe(true);
  });

  it('should be false for password without uppercase', () => {
    password.set('weakpass1!');
    expect(get(passOK)).toBe(false);
  });

  it('should be false for password without lowercase', () => {
    password.set('WEAKPASS1!');
    expect(get(passOK)).toBe(false);
  });

  it('should be false for password without digit', () => {
    password.set('StrongPass!');
    expect(get(passOK)).toBe(false);
  });

  it('should be false for password without special character', () => {
    password.set('StrongPass1');
    expect(get(passOK)).toBe(false);
  });

  it('should be false for password shorter than 8 chars', () => {
    password.set('Aa1!xyz');
    expect(get(passOK)).toBe(false);
  });

  it('should be true for exactly 8 character valid password', () => {
    password.set('Aa1!bbbb');
    expect(get(passOK)).toBe(true);
  });
});

describe('login store - canLogin', () => {
  it('should be false when both email and password are empty', () => {
    expect(get(canLogin)).toBe(false);
  });

  it('should be false when only email is valid', () => {
    email.set('user@example.com');
    password.set('weak');
    expect(get(canLogin)).toBe(false);
  });

  it('should be false when only password is valid', () => {
    email.set('bad-email');
    password.set('StrongP@ss1');
    expect(get(canLogin)).toBe(false);
  });

  it('should be true when both email and password are valid', () => {
    email.set('user@example.com');
    password.set('StrongP@ss1');
    expect(get(canLogin)).toBe(true);
  });
});
