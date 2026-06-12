import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { email, username, password, emailOK, userOK, passOK, canSignup } from '../../../lib/stores/signup';

beforeEach(() => {
  email.set('');
  username.set('');
  password.set('');
});

describe('signup store - emailOK', () => {
  it('should be false for an empty string', () => {
    expect(get(emailOK)).toBe(false);
  });

  it('should be true for a valid email', () => {
    email.set('test@domain.com');
    expect(get(emailOK)).toBe(true);
  });

  it('should be false for email missing TLD', () => {
    email.set('test@domain');
    expect(get(emailOK)).toBe(false);
  });
});

describe('signup store - userOK (username validation)', () => {
  it('should be false for an empty string', () => {
    expect(get(userOK)).toBe(false);
  });

  it('should be false for username shorter than 4 characters', () => {
    username.set('abc');
    expect(get(userOK)).toBe(false);
  });

  it('should be true for exactly 4 characters', () => {
    username.set('abcd');
    expect(get(userOK)).toBe(true);
  });

  it('should be true for exactly 20 characters', () => {
    username.set('a'.repeat(20));
    expect(get(userOK)).toBe(true);
  });

  it('should be false for more than 20 characters', () => {
    username.set('a'.repeat(21));
    expect(get(userOK)).toBe(false);
  });

  it('should accept letters, numbers, and underscores', () => {
    username.set('User_123');
    expect(get(userOK)).toBe(true);
  });

  it('should reject hyphens', () => {
    username.set('user-name');
    expect(get(userOK)).toBe(false);
  });

  it('should reject spaces', () => {
    username.set('user name');
    expect(get(userOK)).toBe(false);
  });

  it('should reject special characters like @', () => {
    username.set('user@name');
    expect(get(userOK)).toBe(false);
  });

  it('should reject dots', () => {
    username.set('user.name');
    expect(get(userOK)).toBe(false);
  });
});

describe('signup store - passOK', () => {
  it('should be false for an empty string', () => {
    expect(get(passOK)).toBe(false);
  });

  it('should be true for a valid password', () => {
    password.set('MyPass1!');
    expect(get(passOK)).toBe(true);
  });

  it('should be false without special char', () => {
    password.set('MyPass12');
    expect(get(passOK)).toBe(false);
  });
});

describe('signup store - canSignup', () => {
  it('should be false when all fields are empty', () => {
    expect(get(canSignup)).toBe(false);
  });

  it('should be false when only two of three are valid', () => {
    email.set('test@domain.com');
    username.set('validuser');
    password.set('weak');
    expect(get(canSignup)).toBe(false);
  });

  it('should be true when all three fields are valid', () => {
    email.set('test@domain.com');
    username.set('validuser');
    password.set('MyPass1!');
    expect(get(canSignup)).toBe(true);
  });

  it('should become false if one field is invalidated after being valid', () => {
    email.set('test@domain.com');
    username.set('validuser');
    password.set('MyPass1!');
    expect(get(canSignup)).toBe(true);

    username.set('ab'); // too short
    expect(get(canSignup)).toBe(false);
  });
});
