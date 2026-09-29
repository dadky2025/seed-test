import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Global floor. A path lowers its threshold only with the reason on the same line.
const FLOOR = { lines: 80, functions: 80, branches: 70, statements: 80 };

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['src/test/setup.ts'],
          // Tests talk to MSW at this origin, never to a real backend.
          env: { VITE_API_BASE_URL: 'http://api.test/' },
        },
      },
      { test: { name: 'tools', environment: 'node', include: ['tools/**/*.test.js'] } },
      {
        extends: true,
        // Runs every story as a test (render + a11y) in a real browser.
        // More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.tsx',
        'src/test/**',
        'src/**/*.d.ts',
        'src/routeTree.gen.ts',
        // Thin wiring, covered by E2E. Excluded rather than given a 0 glob threshold: glob thresholds do
        // not remove files from the global total, so the floor would count them anyway.
        'src/main.tsx', //   entry
        'src/routes/**', //  route modules
        'src/shell/**', //   providers, router, query client
      ],
      reporter: ['text-summary', 'html', 'lcov', 'json-summary'],
      // A path that needs a lower floor gets its own glob entry here, with the reason on the same line.
      thresholds: FLOOR,
    },
  },
});
