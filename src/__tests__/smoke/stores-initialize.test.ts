import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';

// Import stores
import { email as signupEmail, username as signupUsername, password as signupPassword } from '../../lib/stores/signup';
import { serverIp, serverPort, serverData, error as serverError } from '../../lib/stores/server';
import { username as userUsername, userID, userEmail, avatar } from '../../lib/stores/user';
import { name as contactName, email as contactEmail, subject, message } from '../../lib/stores/email';
import { privateProfiles, onProfile, publicProfile, serverProfile, serverID } from '../../lib/stores/profiles';

beforeEach(() => {
  // Reset writable stores to defaults
  signupEmail.set('');
  signupUsername.set('');
  signupPassword.set('');
  serverIp.set('');
  serverPort.set(25565);
  serverData.set(null);
  serverError.set(null);
  userUsername.set('');
  userID.set('');
  userEmail.set('');
  avatar.set('');
  contactName.set('');
  contactEmail.set('');
  subject.set('');
  message.set('');
});

describe('Smoke: Stores initialize with correct defaults', () => {
  it('signup stores default to empty strings', () => {
    expect(get(signupEmail)).toBe('');
    expect(get(signupUsername)).toBe('');
    expect(get(signupPassword)).toBe('');
  });

  it('server stores default correctly', () => {
    expect(get(serverIp)).toBe('');
    expect(get(serverPort)).toBe(25565);
    expect(get(serverData)).toBeNull();
    expect(get(serverError)).toBeNull();
  });

  it('user stores default to empty strings', () => {
    expect(get(userUsername)).toBe('');
    expect(get(userID)).toBe('');
    expect(get(userEmail)).toBe('');
    expect(get(avatar)).toBe('');
  });

  it('email/contact stores default to empty strings', () => {
    expect(get(contactName)).toBe('');
    expect(get(contactEmail)).toBe('');
    expect(get(subject)).toBe('');
    expect(get(message)).toBe('');
  });

  it('profile stores default correctly', () => {
    expect(get(privateProfiles)).toBe(false);
    expect(get(onProfile)).toBe(false);
    expect(get(publicProfile)).toBe(false);
    expect(get(serverProfile)).toBeNull();
    expect(get(serverID)).toBeNull();
  });
});
