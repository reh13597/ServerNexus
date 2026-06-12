import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import App from '../../App.svelte';

// Mock svelte-spa-router to avoid actual routing
vi.mock('svelte-spa-router', () => ({
  default: vi.fn(),
  push: vi.fn(),
  wrap: vi.fn((opts: any) => opts),
  location: { subscribe: vi.fn((cb: any) => { cb('/'); return vi.fn(); }) },
}));

vi.mock('svelte-spa-router/wrap', () => ({
  wrap: vi.fn((opts: any) => opts),
}));

describe('Smoke: App renders', () => {
  it('App component mounts without throwing', () => {
    expect(() => render(App)).not.toThrow();
  });

  it('App renders a main element', () => {
    const { container } = render(App);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
  });
});
