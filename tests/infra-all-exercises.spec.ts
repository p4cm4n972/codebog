/**
 * Test d'infrastructure — Tous les exercices en live
 *
 * Ce test ne vérifie PAS si les solutions sont correctes.
 * Il vérifie que la PLOMBERIE fonctionne pour chaque exercice :
 *   1. La page charge et Monaco est visible
 *   2. Le bouton test/submit est présent
 *   3. L'API de test retourne du JSON valide (pas un 500 ni du HTML)
 *
 * Lancé avec : npx playwright test tests/infra-all-exercises.spec.ts
 */

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const EMAIL = 'manuel.adele@gmail.com';
const PASSWORD = 'alleluia';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Vérifie qu'une réponse HTTP est du JSON valide (pas un 500 / HTML) */
function assertJsonResponse(status: number, contentType: string, body: string, label: string) {
    expect(status, `${label}: HTTP status doit être < 500`).toBeLessThan(500);
    expect(
        contentType.includes('application/json') && body.trimStart().startsWith('{'),
        `${label}: réponse doit être JSON (reçu: ${contentType} | début: ${body.slice(0, 80)})`
    ).toBe(true);
}

// ── JSBOG — tous les exercices JS (chrono / piscine-js-expert) ────────────────

const JSBOG_MODULES: { season: string; module: string }[] = [
    { season: 'chrono', module: 'fundamentals' },
    { season: 'chrono', module: 'structures' },
    { season: 'chrono', module: 'async' },
];

async function fetchJsbogModule(
    page: import('@playwright/test').Page,
    season: string,
    module: string
): Promise<{ slug: string; title: string }[]> {
    const resp = await page.request.get(`${BASE}/api/jsbog/exercises?season=${season}&module=${module}`);
    if (!resp.ok()) return [];
    const data = await resp.json() as { exercises?: { slug: string; title: string }[] };
    return data.exercises ?? [];
}

async function runJsbogInfraTest(
    page: import('@playwright/test').Page,
    exercises: { slug: string; title: string }[],
    season: string,
    module: string
) {
    const failures: string[] = [];

    console.log(`  ${module}: ${exercises.length} exercice(s) à tester`);

    for (const ex of exercises) {
        // URL réelle : /jsbog/{season}/{module}/{slug}
        await page.goto(`${BASE}/jsbog/${season}/${module}/${ex.slug}`);

        const monacoOk = await page.waitForSelector('.monaco-editor', { timeout: 20000 })
            .then(() => true).catch(() => false);
        if (!monacoOk) { failures.push(`${ex.slug}: Monaco non chargé`); continue; }

        const btnOk = await page.locator('button:has-text("SOUMETTRE")').isVisible().catch(() => false);
        if (!btnOk) { failures.push(`${ex.slug}: bouton SOUMETTRE absent`); continue; }

        const respPromise = page.waitForResponse(
            r => r.url().includes('/api/execute') && r.request().method() === 'POST',
            { timeout: 20_000 }
        );
        await page.evaluate(() => {
            const btn = [...document.querySelectorAll('button')]
                .find(b => b.textContent?.includes('SOUMETTRE'));
            if (btn) (btn as HTMLElement).click();
        });

        try {
            const resp = await respPromise;
            const ct = resp.headers()['content-type'] ?? '';
            const body = await resp.text();
            console.log(`  ${ex.slug}: HTTP ${resp.status()}`);
            try { assertJsonResponse(resp.status(), ct, body, ex.slug); }
            catch (e) { failures.push(`${ex.slug}: ${(e as Error).message}`); }
        } catch {
            failures.push(`${ex.slug}: pas de réponse /api/execute dans les 20s`);
        }
    }

    if (failures.length > 0) {
        console.error('JSBOG failures:\n' + failures.map(f => `  ✗ ${f}`).join('\n'));
    }
    expect(failures, `${failures.length} exercice(s) JSBOG avec problème infra`).toHaveLength(0);
}

// Un test par module pour rester dans les timeouts Playwright
for (const { season, module } of JSBOG_MODULES) {
    test.describe(`JSBOG — infrastructure (${module})`, () => {
        test.setTimeout(300_000); // ~10 exercices × 20s = 200s max

        test.beforeEach(async ({ page }) => {
            await page.goto(`${BASE}/login`);
            await page.fill('input[type="email"]', EMAIL);
            await page.fill('input[type="password"]', PASSWORD);
            await page.click('button[type="submit"]');
            await page.waitForURL('**/profile', { timeout: 15000 });
        });

        test(`Monaco + API /api/execute valide (${season}/${module})`, async ({ page }) => {
            const exercises = await fetchJsbogModule(page, season, module);
            expect(exercises.length, `Aucun exercice dans ${module}`).toBeGreaterThan(0);
            console.log(`${module}: ${exercises.length} exercices`);
            await runJsbogInfraTest(page, exercises, season, module);
        });
    });
}

// ── CBOG — exercices C (toutes les semaines) ──────────────────────────────────

const CBOG_WEEKS = ['semaine1', 'semaine2', 'semaine3', 'semaine4'];

/**
 * Récupère les slugs d'exercices CBOG d'une semaine en scrapant la page week.
 * Les slugs sont dans les href des liens /cbog/<slug>
 */
async function fetchCbogSlugsForWeek(
    page: import('@playwright/test').Page,
    weekSlug: string
): Promise<string[]> {
    await page.goto(`${BASE}/cbog/week/${weekSlug}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const hrefs = await page.locator('a[href^="/cbog/"]:not([href*="/week/"])').evaluateAll(
        els => els.map(e => (e as HTMLAnchorElement).href)
    );
    return [...new Set(hrefs.map(h => h.replace(/.*\/cbog\//, '').replace(/\?.*/, '')))];
}

test.describe('CBOG — infrastructure (tous les exercices C)', () => {
    test.setTimeout(600_000); // 10 min selon le nombre d'exercices

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE}/login`);
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/profile', { timeout: 15000 });
    });

    test('Monaco + API /api/submissions/c valide pour chaque exercice', async ({ page }) => {
        const failures: string[] = [];
        let total = 0;

        for (const week of CBOG_WEEKS) {
            const slugs = await fetchCbogSlugsForWeek(page, week);
            console.log(`${week}: ${slugs.length} exercices`);

            for (const slug of slugs) {
                if (!slug || slug === '') continue;
                total++;
                const url = `${BASE}/cbog/${slug}`;
                await page.goto(url);

                const monacoOk = await page.waitForSelector('.monaco-editor', { timeout: 20000 })
                    .then(() => true)
                    .catch(() => false);

                if (!monacoOk) {
                    failures.push(`CBOG/${slug}: Monaco non chargé`);
                    continue;
                }

                const btnOk = await page.locator('button:has-text("run_tests")').isVisible()
                    .catch(() => false);
                if (!btnOk) {
                    failures.push(`CBOG/${slug}: bouton run_tests absent`);
                    continue;
                }

                // Soumettre code vide → API doit répondre en JSON (erreur de compilation OK)
                const respPromise = page.waitForResponse(
                    r => r.url().includes('/api/submissions/c') && r.request().method() === 'POST',
                    { timeout: 30_000 }
                );
                await page.locator('button:has-text("run_tests")').evaluate(
                    (btn: HTMLElement) => btn.click()
                );

                try {
                    const resp = await respPromise;
                    const ct = resp.headers()['content-type'] ?? '';
                    const body = await resp.text();
                    console.log(`  ${slug}: HTTP ${resp.status()} — ${body.slice(0, 120)}`);
                    try {
                        assertJsonResponse(resp.status(), ct, body, `CBOG/${slug}`);
                    } catch (e) {
                        failures.push(`CBOG/${slug}: ${(e as Error).message}`);
                    }
                } catch {
                    failures.push(`CBOG/${slug}: pas de réponse /api/submissions/c dans les 30s`);
                }
            }
        }

        console.log(`CBOG total exercices testés: ${total}`);
        if (failures.length > 0) {
            console.error('CBOG infrastructure failures:\n' + failures.map(f => `  ✗ ${f}`).join('\n'));
        }
        expect(failures, `${failures.length} exercice(s) CBOG avec problème infra`).toHaveLength(0);
    });
});

// ── ALGOBOG — 1 problème par building (downtown accessible par défaut) ─────────

const ALGOBOG_BUILDINGS = [
    'array-tower',
    'string-plaza',
    'hash-hub',
    'two-pointers-bridge',
    'binary-search-center',
    'sliding-window-mall',
    'sorting-station',
    'stack-skyscraper',
];

async function fetchFirstProblemSlug(
    page: import('@playwright/test').Page,
    building: string
): Promise<string | null> {
    const resp = await page.request.get(`${BASE}/api/algobog/problems?building=${building}&limit=1`);
    if (!resp.ok()) return null;
    const data = await resp.json() as { problems?: { slug: string; order: number }[] };
    const sorted = (data.problems ?? []).sort((a, b) => a.order - b.order);
    return sorted[0]?.slug ?? null;
}

test.describe('ALGOBOG — infrastructure (premier problème par building)', () => {
    test.setTimeout(300_000);

    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE}/login`);
        await page.fill('input[type="email"]', EMAIL);
        await page.fill('input[type="password"]', PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForURL('**/profile', { timeout: 15000 });
    });

    test('Monaco + API /api/execute valide pour le premier problème de chaque building', async ({ page }) => {
        const failures: string[] = [];

        for (const building of ALGOBOG_BUILDINGS) {
            const slug = await fetchFirstProblemSlug(page, building);
            if (!slug) {
                console.log(`${building}: aucun problème trouvé, ignoré`);
                continue;
            }

            const url = `${BASE}/algobog/problem/${slug}`;
            await page.goto(url);
            await page.waitForLoadState('networkidle', { timeout: 15000 });

            // La page peut afficher "VERROUILLÉ" si le building n'est pas accessible
            const isLocked = await page.locator('text=PROBLÈME VERROUILLÉ').isVisible()
                .catch(() => false);
            if (isLocked) {
                console.log(`${building}/${slug}: verrouillé (progression insuffisante) — infra OK`);
                continue;
            }

            const monacoOk = await page.waitForSelector('.monaco-editor', { timeout: 25000 })
                .then(() => true)
                .catch(() => false);

            if (!monacoOk) {
                failures.push(`ALGO/${building}/${slug}: Monaco non chargé`);
                continue;
            }

            // Bouton TESTER présent
            const btnOk = await page.locator('button:has-text("TESTER")').isVisible()
                .catch(() => false);
            if (!btnOk) {
                failures.push(`ALGO/${building}/${slug}: bouton TESTER absent`);
                continue;
            }

            // Soumettre code vide → JSON valide
            const respPromise = page.waitForResponse(
                r => r.url().includes('/api/execute') && r.request().method() === 'POST',
                { timeout: 20_000 }
            );
            await page.evaluate(() => {
                const btn = [...document.querySelectorAll('button')]
                    .find(b => b.textContent?.includes('TESTER'));
                if (btn) (btn as HTMLElement).click();
            });

            try {
                const resp = await respPromise;
                const ct = resp.headers()['content-type'] ?? '';
                const body = await resp.text();
                try {
                    assertJsonResponse(resp.status(), ct, body, `ALGO/${building}/${slug}`);
                } catch (e) {
                    failures.push(`ALGO/${building}/${slug}: ${(e as Error).message}`);
                }
            } catch {
                failures.push(`ALGO/${building}/${slug}: pas de réponse /api/execute dans les 20s`);
            }
        }

        if (failures.length > 0) {
            console.error('ALGOBOG infrastructure failures:\n' + failures.map(f => `  ✗ ${f}`).join('\n'));
        }
        expect(failures, `${failures.length} problème(s) ALGOBOG avec problème infra`).toHaveLength(0);
    });
});
