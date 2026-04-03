import { test, expect } from '@playwright/test';

const EMAIL = 'test-cloud@codebog.test';
const PASSWORD = 'password123';
const EXERCISE_URL = 'http://localhost:3000/cbog/ft_comb';

test.describe('CBOG — flow WASM (client-side compilation)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/profile', { timeout: 15000 });
    });

    test('charge la page exercice avec éditeur Monaco', async ({ page }) => {
        await page.goto(EXERCISE_URL);
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });

        // Titre présent
        const h1 = await page.locator('h1').first().textContent();
        expect(h1).toBeTruthy();

        // Bouton test présent
        await expect(page.locator('button:has-text("run_tests")')).toBeVisible();

        // Bouton soumettre présent (désactivé initialement)
        const submitBtn = page.locator('button:has-text("SOUMETTRE")');
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeDisabled();

        await page.screenshot({ path: 'test-results/cbog-loaded.png' });
    });

    // clang/clang package is ~100MB — first load takes 30-120s depending on connection
    test('exécute un test WASM et active le bouton soumettre', async ({ page }) => {
        test.setTimeout(300_000);

        // Capturer les logs console du browser (erreurs WASM, etc.)
        const browserLogs: string[] = [];
        page.on('console', msg => {
            const text = msg.text();
            browserLogs.push(`[${msg.type()}] ${text}`);
        });

        await page.goto(EXERCISE_URL);
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });
        await page.waitForTimeout(2000); // Monaco init

        // Injecter une solution correcte via Monaco
        await page.evaluate(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const monaco = (window as any).monaco;
            if (monaco) {
                const editor = monaco.editor.getEditors()[0];
                if (editor) {
                    editor.setValue(`#include <unistd.h>

void\tft_comb(int max, int current, char *str)
{
    int\ti;

    if (current == max)
    {
        write(1, str, max);
        write(1, "\\n", 1);
        return ;
    }
    i = (current == 0) ? '0' : str[current - 1] + 1;
    while (i <= '9' - (max - current - 1))
    {
        str[current] = i;
        ft_comb(max, current + 1, str);
        i++;
    }
}`);
                }
            }
        });

        // Cliquer sur [$ ./run_tests]
        await page.click('button:has-text("run_tests")');

        // Attendre la fin — le spinner "compilation..." doit apparaître puis disparaître
        await page.waitForSelector('text=compilation...', { timeout: 5000 }).catch(() => {});

        // Attendre le résultat (le WASM peut prendre ~10-60s au premier chargement)
        await page.waitForFunction(
            () => {
                const btns = document.querySelectorAll('button');
                for (const btn of btns) {
                    if (btn.textContent?.includes('SOUMETTRE') && !btn.disabled) return true;
                    if (btn.textContent?.includes('FAIL') || btn.textContent?.includes('OK')) return true;
                }
                // Aussi vérifier un message de résultat
                return !!document.querySelector('[class*="border-green-600"]') ||
                       !!document.querySelector('[class*="border-red-8"]') ||
                       !!document.querySelector('[class*="border-amber-7"]');
            },
            { timeout: 120_000 }
        );

        await page.screenshot({ path: 'test-results/cbog-after-test.png' });

        // Vérifier l'état final
        const submitBtn = page.locator('button:has-text("SOUMETTRE")');
        const isEnabled = await submitBtn.isEnabled();
        console.log('Submit enabled:', isEnabled);

        await page.screenshot({ path: 'test-results/cbog-after-test.png' });

        // Le bouton soumettre doit être actif : les tests ont passé via Judge0
        expect(isEnabled).toBe(true);
    });
});
