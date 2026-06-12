import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://test.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('test-anon-key'),
    'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify('test_service'),
    'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify('test_template'),
    'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify('test_public_key'),
  },
  resolve: {
    conditions: ['browser'],
    alias: {
      $lib: '/src/lib',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.ts'],
    setupFiles: ['src/__tests__/setup.ts'],
    alias: {
      $lib: '/src/lib',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/lib/**/*.ts', 'src/lib/**/*.svelte'],
      exclude: ['src/lib/app.css', 'src/**/*.d.ts'],
      // Thresholds enforced only in full test:coverage runs, not partial CI jobs
      // thresholds: { statements: 40, branches: 40, functions: 40, lines: 40 },
    },
    restoreMocks: true,
  },
});
