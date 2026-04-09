import { test, expect } from '@playwright/test';

const EMAIL = 'test-cloud@codebog.test';
const PASSWORD = 'password123';


test.describe('CBOG Submission', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/profile', { timeout: 15000 });
    });

    test('should load CBOG exercise page with content', async ({ page }) => {
        // Navigate to a CBOG exercise
        await page.goto('http://localhost:3000/cbog/ft_putchar');

        // Wait for Monaco editor to be ready
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });

        // Verify exercise title is visible
        const title = await page.locator('h1').first().textContent();
        expect(title).toBeTruthy();

        // Verify test button is present
        await expect(page.locator('button:has-text("run_tests")')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'test-results/cbog-exercise-loaded.png' });
    });

    test('soumet la solution correcte ft_putchar et reçoit tests passés', async ({ page }) => {
        test.setTimeout(60_000);

        const FT_PUTCHAR_SOLUTION = `#include <unistd.h>\n\nvoid\tft_putchar(char c)\n{\n\twrite(1, &c, 1);\n}\n`;

        await page.goto('http://localhost:3000/cbog/ft_putchar');
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });
        await page.waitForTimeout(1500); // Monaco init

        // Injecter la solution correcte via l'API Monaco
        await page.evaluate((solution) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const monaco = (window as any).monaco;
            if (monaco) {
                const editor = monaco.editor.getEditors()[0];
                if (editor) editor.setValue(solution);
            }
        }, FT_PUTCHAR_SOLUTION);

        // Intercepter /api/submissions/c AVANT de cliquer
        const apiResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/submissions/c') && resp.request().method() === 'POST',
            { timeout: 45_000 }
        );

        // JS btn.click() bypasses overlay intercept and triggers React's synthetic onClick
        await page.locator('button:has-text("run_tests")').evaluate((btn: HTMLElement) => btn.click());
        await page.waitForTimeout(1000); // Give React handler a cycle to fire

        const apiResponse = await apiResponsePromise;
        const data = await apiResponse.json();

        console.log('CBOG test status:', apiResponse.status());
        console.log('CBOG results.passed:', data.results?.passed);
        console.log('CBOG results.compiled:', data.results?.compiled);

        await page.screenshot({ path: 'test-results/cbog-after-test.png' });

        expect(apiResponse.status()).toBe(200);
        expect(data.results?.compiled).toBe(true);
        expect(data.results?.passed).toBe(true);

        // Le message de succès doit être visible dans l'UI
        await expect(page.locator('text=[OK] Tests passés')).toBeVisible({ timeout: 5000 });
    });
});
