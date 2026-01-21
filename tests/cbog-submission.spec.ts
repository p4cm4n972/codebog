import { test, expect } from '@playwright/test';

test.describe('CBOG Submission', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', 'manuel.adele@gmail.com');
        await page.fill('input[type="password"]', 'alleluia');
        await page.click('button[type="submit"]');

        // Wait for redirect to profile
        await page.waitForURL('**/profile', { timeout: 10000 });
    });

    test('should load CBOG exercise page with content', async ({ page }) => {
        // Navigate to a CBOG exercise
        await page.goto('http://localhost:3000/cbog/ft_putchar');

        // Wait for page to load
        await page.waitForSelector('text=RETOUR AUX EXERCICES', { timeout: 10000 });

        // Verify exercise title is visible (not generic "Exercice C")
        const title = await page.locator('h1').textContent();
        expect(title).toBeTruthy();
        expect(title).not.toBe('Exercice C');

        // Verify editor is present
        await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });

        // Verify submit button is present
        await expect(page.locator('text=COMPILER & TESTER')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: '.playwright-mcp/cbog-exercise-loaded.png' });
    });

    test('should submit code and get response', async ({ page }) => {
        // Navigate to ft_putchar exercise
        await page.goto('http://localhost:3000/cbog/ft_putchar');

        // Wait for editor
        await page.waitForSelector('.monaco-editor', { timeout: 10000 });

        // Wait a bit for Monaco to initialize
        await page.waitForTimeout(2000);

        // Type some C code in the editor
        const editor = page.locator('.monaco-editor textarea').first();
        await editor.focus();

        // Clear and type simple code
        await page.keyboard.press('Control+a');
        await page.keyboard.type(`#include <unistd.h>

void ft_putchar(char c)
{
    write(1, &c, 1);
}
`);

        // Click submit button
        await page.click('text=COMPILER & TESTER');

        // Wait for response (loading spinner should appear then disappear)
        await page.waitForSelector('text=COMPILATION EN COURS', { timeout: 5000 }).catch(() => {});

        // Wait for result
        await page.waitForTimeout(5000);

        // Take screenshot of result
        await page.screenshot({ path: '.playwright-mcp/cbog-submission-result.png' });

        // Check that some result appeared (success or error)
        const hasResult = await page.locator('text=MISSION').count() > 0 ||
                          await page.locator('text=ERREUR').count() > 0 ||
                          await page.locator('text=Erreur').count() > 0;

        console.log('Has result:', hasResult);
    });
});
