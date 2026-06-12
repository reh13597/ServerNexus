import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import Contact from '../../lib/pages/Contact.svelte';
import { name, email, subject, message } from '../../lib/stores/email';
import { get } from 'svelte/store';

// Mock global fetch for the /api/send-email endpoint
const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  name.set('');
  email.set('');
  subject.set('');
  message.set('');
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

async function fillContactForm() {
  await fireEvent.input(screen.getByPlaceholderText('Herobrine Persson'), { target: { value: 'Test User' } });
  await fireEvent.input(screen.getByPlaceholderText('herobrine@nether.com'), { target: { value: 'test@mail.com' } });
  await fireEvent.input(screen.getByPlaceholderText('What is this about?'), { target: { value: 'Bug Report' } });
  await fireEvent.input(screen.getByPlaceholderText('Write your message here...'), {
    target: { value: 'This is a sufficiently long test message for validation.' },
  });
}

describe('Contact page integration', () => {
  it('renders the contact form', () => {
    render(Contact);
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Herobrine Persson')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What is this about?')).toBeInTheDocument();
  });

  it('send button is disabled when form is incomplete', () => {
    render(Contact);
    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
  });

  it('shows character counter when message is too short', async () => {
    render(Contact);
    await fireEvent.input(screen.getByPlaceholderText('Herobrine Persson'), { target: { value: 'Name' } });
    await fireEvent.input(screen.getByPlaceholderText('herobrine@nether.com'), { target: { value: 'a@b.com' } });
    await fireEvent.input(screen.getByPlaceholderText('What is this about?'), { target: { value: 'Subject' } });
    await fireEvent.input(screen.getByPlaceholderText('Write your message here...'), { target: { value: 'Short' } });

    await waitFor(() => {
      expect(screen.getByText(/15 more characters required/i)).toBeInTheDocument();
    });
  });

  it('character counter disappears when message is long enough', async () => {
    render(Contact);
    await fillContactForm();

    await waitFor(() => {
      expect(screen.queryByText(/more character/i)).not.toBeInTheDocument();
    });
  });

  it('send button becomes enabled with complete form', async () => {
    render(Contact);
    await fillContactForm();

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /send message/i });
      expect(button).not.toBeDisabled();
    });
  });

  it('calls /api/send-email on submission', async () => {
    render(Contact);
    await fillContactForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
    });

    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/send-email', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
    });
  });

  it('shows success message and clears form after successful send', async () => {
    render(Contact);
    await fillContactForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
    });

    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });

    // Stores should be cleared
    expect(get(name)).toBe('');
    expect(get(email)).toBe('');
    expect(get(subject)).toBe('');
    expect(get(message)).toBe('');
  });

  it('shows error message when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(Contact);
    await fillContactForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
    });

    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });
});
