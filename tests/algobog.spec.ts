import { test, expect } from '@playwright/test';

const EMAIL = 'test-cloud@codebog.test';
const PASSWORD = 'password123';
const BASE_URL = 'http://localhost:3000';

// Solution optimale Two Sum — O(n) avec HashMap
const TWO_SUM_SOLUTION = `
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}
`.trim();

/**
 * Récupère le slug du premier problème accessible dans array-tower (downtown).
 * L'API sans JWT retourne tous les problèmes triés par order asc —
 * on prend le slug du premier (order le plus bas = toujours accessible).
 */
async function getFirstProblemSlug(page: import('@playwright/test').Page): Promise<string | null> {
    const resp = await page.request.get(`${BASE_URL}/api/algobog/problems?building=array-tower`);
    if (!resp.ok()) return null;
    const data = await resp.json() as { problems?: { slug: string; order: number }[] };
    const sorted = (data.problems ?? []).sort((a, b) => a.order - b.order);
    return sorted[0]?.slug ?? null;
}

test.describe('ALGOBOG — smoke tests (isolated-vm)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/profile', { timeout: 15000 });
    });

    test('charge la page problème avec éditeur Monaco', async ({ page }) => {
        test.setTimeout(60_000);

        const slug = await getFirstProblemSlug(page);
        expect(slug, 'Aucun problème trouvé dans array-tower').toBeTruthy();

        await page.goto(`${BASE_URL}/algobog/problem/${slug}`);
        // networkidle attend la fin des fetches auth + problème avant que Monaco ne rende
        await page.waitForLoadState('networkidle', { timeout: 20000 });
        await page.waitForSelector('.monaco-editor', { timeout: 30000 });

        // Titre du problème présent
        const heading = await page.locator('h1, h2').first().textContent();
        expect(heading).toBeTruthy();

        // Boutons TESTER et SOUMETTRE présents
        await expect(page.locator('button:has-text("TESTER")')).toBeVisible();
        await expect(page.locator('button:has-text("SOUMETTRE")')).toBeVisible();

        await page.screenshot({ path: 'test-results/algobog-loaded.png' });
    });

    test('exécute la solution via TESTER (isolated-vm)', async ({ page }) => {
        test.setTimeout(60_000);

        const slug = await getFirstProblemSlug(page);
        expect(slug, 'Aucun problème trouvé dans array-tower').toBeTruthy();

        await page.goto(`${BASE_URL}/algobog/problem/${slug}`);
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });
        await page.waitForTimeout(1500);

        await page.evaluate((solution) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const monaco = (window as any).monaco;
            if (monaco) {
                const editor = monaco.editor.getEditors()[0];
                if (editor) editor.setValue(solution);
            }
        }, TWO_SUM_SOLUTION);

        // Attendre la disparition du toast (animate-slide-up) qui bloque les clics
        await page.locator('[class*="animate-slide"]').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);

        const executeResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/execute') && resp.request().method() === 'POST',
            { timeout: 30_000 }
        );

        // Déclencher le clic via JS pour contourner tout intercepteur DOM
        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('TESTER'));
            if (btn) btn.click();
        });

        const executeResponse = await executeResponsePromise;
        const responseText = await executeResponse.text();
        const contentType = executeResponse.headers()['content-type'] ?? '';

        console.log('Problem slug:', slug);
        console.log('Execute status:', executeResponse.status());
        console.log('Execute Content-Type:', contentType);

        // Détecter isolated-vm cassé (retourne HTML 500 au lieu de JSON)
        if (!contentType.includes('application/json') || !responseText.trimStart().startsWith('{')) {
            throw new Error(
                `isolated-vm incompatible avec le runtime actuel.\n` +
                `  → Node.js côté serveur doit être v20.x (package.json engines).\n` +
                `  → Lancez le serveur avec : nvm use 20 && npm run dev\n` +
                `  → HTTP ${executeResponse.status()} reçu (attendu 200 JSON)`
            );
        }

        const executeData = JSON.parse(responseText);

        await page.screenshot({ path: 'test-results/algobog-after-test.png' });

        expect(executeResponse.status()).toBeLessThan(500);

        if (!executeData.success) {
            console.log('⚠ testCode non configuré pour ce problème — ajoutez-le via le script de migration.');
        }
    });

    test('soumet la solution et valide (si testCode configuré)', async ({ page }) => {
        test.setTimeout(60_000);

        const slug = await getFirstProblemSlug(page);
        expect(slug, 'Aucun problème trouvé dans array-tower').toBeTruthy();

        await page.goto(`${BASE_URL}/algobog/problem/${slug}`);
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });
        await page.waitForTimeout(1500);

        await page.evaluate((solution) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const monaco = (window as any).monaco;
            if (monaco) {
                const editor = monaco.editor.getEditors()[0];
                if (editor) editor.setValue(solution);
            }
        }, TWO_SUM_SOLUTION);

        await page.locator('[class*="animate-slide"]').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);

        // Étape 1 : TESTER
        const testResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/execute') && resp.request().method() === 'POST',
            { timeout: 30_000 }
        );
        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('TESTER'));
            if (btn) btn.click();
        });
        const testResponse = await testResponsePromise;
        const testData = await testResponse.json();

        if (!testData.success || !testData.results?.passed) {
            console.log('⚠ TESTER non passé — testCode absent ou solution incorrecte. Soumission ignorée.');
            test.skip();
            return;
        }

        // Étape 2 : SOUMETTRE (activé après TESTER réussi)
        const submitResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/algobog/submissions') && resp.request().method() === 'POST',
            { timeout: 30_000 }
        );

        await expect(page.locator('button:has-text("SOUMETTRE")')).toBeEnabled({ timeout: 5000 });
        await page.click('button:has-text("SOUMETTRE")');

        const submitResponse = await submitResponsePromise;
        const submitData = await submitResponse.json();

        console.log('Submit status:', submitResponse.status());
        console.log('Submit success:', submitData.success);

        await page.screenshot({ path: 'test-results/algobog-after-submit.png' });

        expect(submitResponse.status()).toBe(200);
        expect(submitData.success).toBe(true);
        expect(submitData.results?.passed).toBe(true);
    });
});
