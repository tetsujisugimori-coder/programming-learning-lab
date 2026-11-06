import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1, timeout: 90000,
  reporter: [['list'], ['json', { outputFile: 'docs/evidence/browser-results.json' }]],
  use: { baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:43871', trace: 'retain-on-failure' },
  webServer: process.env.E2E_BASE_URL ? undefined : { command: 'npm run preview -- --port 43871 --strictPort', url: 'http://127.0.0.1:43871', reuseExistingServer: false },
  projects: [
    ...['chromium', 'webkit'].flatMap(browserName => [1280, 390, 375].map(width => ({
      name: `${browserName}-${width}`, use: { browserName: browserName as 'chromium' | 'webkit', viewport: { width, height: 950 } },
    }))),
  ],
});
