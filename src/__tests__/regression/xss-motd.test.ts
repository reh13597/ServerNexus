import { describe, it, expect } from 'vitest';
import DOMPurify from 'dompurify';

describe('Regression: XSS via MOTD HTML', () => {
  it('DOMPurify strips script tags from MOTD html', () => {
    const maliciousMOTD = '<span>Welcome!</span><script>alert("xss")</script>';
    const sanitized = DOMPurify.sanitize(maliciousMOTD);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Welcome!');
  });

  it('DOMPurify strips event handlers from MOTD html', () => {
    const maliciousMOTD = '<span onmouseover="alert(1)">Hover me</span>';
    const sanitized = DOMPurify.sanitize(maliciousMOTD);

    expect(sanitized).not.toContain('onmouseover');
    expect(sanitized).toContain('Hover me');
  });

  it('DOMPurify preserves safe formatting tags', () => {
    const safeMOTD = '<span style="color:#55ff55"><b>Hypixel Network</b></span>';
    const sanitized = DOMPurify.sanitize(safeMOTD);

    expect(sanitized).toContain('<b>Hypixel Network</b>');
  });

  it('DOMPurify strips iframe injection attempts', () => {
    const maliciousMOTD = '<span>Server</span><iframe src="https://evil.com"></iframe>';
    const sanitized = DOMPurify.sanitize(maliciousMOTD);

    expect(sanitized).not.toContain('<iframe');
    expect(sanitized).toContain('Server');
  });

  it('handles empty MOTD html', () => {
    const sanitized = DOMPurify.sanitize('');
    expect(sanitized).toBe('');
  });

  it('handles null/undefined MOTD gracefully', () => {
    const sanitized = DOMPurify.sanitize(null as any);
    expect(sanitized).toBe('');
  });
});
