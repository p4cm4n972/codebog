import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    // Run tests serially to avoid Appwrite rate limiting
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'line',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Server should be started manually before running tests
    // npm run dev
});
