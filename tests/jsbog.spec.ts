import { test, expect } from '@playwright/test';

const EMAIL = 'test-cloud@codebog.test';
const PASSWORD = 'password123';
// Premier exercice piscine-js-expert (slug = nom du répertoire)
const EXERCISE_URL = 'http://localhost:3000/jsbog/exercises/ex00';

// Solution correcte pour ex00 — compose & pipe
// compose: droite → gauche ; pipe: gauche → droite
const EX00_SOLUTION = `
function compose(...fns) {
  return (x) => fns.reduceRight((v, f) => f(v), x);
}

function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}
`.trim();

test.describe('JSBOG — smoke tests (isolated-vm)', () => {
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

        const h1 = await page.locator('h1').first().textContent();
        expect(h1).toBeTruthy();

        await expect(page.locator('button:has-text("SOUMETTRE")')).toBeVisible();

        await page.screenshot({ path: 'test-results/jsbog-loaded.png' });
    });

    test('soumet la solution compose/pipe et reçoit une validation (isolated-vm)', async ({ page }) => {
        test.setTimeout(60_000);

        await page.goto(EXERCISE_URL);
        await page.waitForSelector('.monaco-editor', { timeout: 15000 });
        await page.waitForTimeout(1500); // Monaco init

        // Injecter la solution via l'API Monaco
        await page.evaluate((solution) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const monaco = (window as any).monaco;
            if (monaco) {
                const editor = monaco.editor.getEditors()[0];
                if (editor) editor.setValue(solution);
            }
        }, EX00_SOLUTION);

        // Intercepter la réponse /api/execute AVANT de cliquer (Judge isolated-vm est synchrone ~100ms)
        const executeResponsePromise = page.waitForResponse(
            resp => resp.url().includes('/api/execute') && resp.request().method() === 'POST',
            { timeout: 30_000 }
        );

        await page.click('button:has-text("SOUMETTRE")');

        const executeResponse = await executeResponsePromise;
        const responseText = await executeResponse.text();
        const contentType = executeResponse.headers()['content-type'] ?? '';

        console.log('Execute status:', executeResponse.status());
        console.log('Execute Content-Type:', contentType);

        // Si le serveur retourne du HTML (500), c'est que isolated-vm ne peut pas être chargé
        // (typiquement : module compilé pour Node 20, serveur tourne sur Node 25+)
        if (!contentType.includes('application/json') || !responseText.trimStart().startsWith('{')) {
            const nodeVersion = await page.evaluate(() => (window as unknown as { process?: { version?: string } }).process?.version ?? 'inconnu');
            throw new Error(
                `isolated-vm incompatible avec le runtime actuel.\n` +
                `  → Node.js côté serveur doit être v20.x (package.json engines).\n` +
                `  → Lancez le serveur avec : nvm use 20 && npm run dev\n` +
                `  → HTTP ${executeResponse.status()} reçu (attendu 200 JSON)\n` +
                `  → Node client : ${nodeVersion}`
            );
        }

        const executeData = JSON.parse(responseText);
        console.log('Execute success:', executeData.success);
        console.log('Execute passed:', executeData.results?.passed);

        await page.screenshot({ path: 'test-results/jsbog-after-submit.png' });

        expect(executeResponse.status()).toBe(200);
        expect(executeData.success).toBe(true);
        expect(executeData.results?.passed).toBe(true);
    });
});
