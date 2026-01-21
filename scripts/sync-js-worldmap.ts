import { Client, Databases, ID, Query } from 'node-appwrite';
import * as fs from 'fs';
import * as path from 'path';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';

const JS_WORLDS_COLLECTION_ID = 'js-worlds';
const JS_LEVELS_COLLECTION_ID = 'js-levels';

const PISCINE_PATH = path.join(__dirname, 'piscine-js-expert');

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Variables d\'environnement manquantes.');
    process.exit(1);
}

const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

// World definitions with positions for the map
const WORLDS_CONFIG = [
    {
        slug: 'fondations',
        name: 'Fondations',
        description: 'Les bases essentielles de JavaScript ES6+. Types, fonctions, arrays, objects...',
        icon: '🏠',
        color: 'green',
        bgGradient: 'from-green-600 to-green-800',
        posX: 50,
        posY: 85,
        order: 1,
        difficulty: 'beginner',
        tags: JSON.stringify(['types', 'arrays', 'objects', 'functions', 'es6']),
        sourcePath: 'module-0',
        unlockRequirement: null
    },
    {
        slug: 'fp-valley',
        name: 'FP Valley',
        description: 'Programmation fonctionnelle : compose, curry, memoization, monads...',
        icon: '🌿',
        color: 'purple',
        bgGradient: 'from-purple-600 to-purple-800',
        posX: 25,
        posY: 60,
        order: 2,
        difficulty: 'intermediate',
        tags: JSON.stringify(['functional', 'compose', 'curry', 'monad', 'lazy']),
        sourceExercises: ['ex00', 'ex01', 'ex02', 'ex03', 'ex04'],
        unlockRequirement: JSON.stringify({ worldSlug: 'fondations', minPercent: 50 })
    },
    {
        slug: 'async-forest',
        name: 'Async Forest',
        description: 'Maîtrise de l\'asynchronisme : Promises, async/await, generators...',
        icon: '🌲',
        color: 'orange',
        bgGradient: 'from-orange-600 to-orange-800',
        posX: 75,
        posY: 60,
        order: 3,
        difficulty: 'intermediate',
        tags: JSON.stringify(['async', 'promise', 'generator', 'control-flow']),
        sourceExercises: ['ex05', 'ex06', 'ex07'],
        unlockRequirement: JSON.stringify({ worldSlug: 'fondations', minPercent: 100 })
    },
    {
        slug: 'closures-cave',
        name: 'Closures Cave',
        description: 'Les closures en profondeur : module pattern, encapsulation, scope...',
        icon: '🕳️',
        color: 'cyan',
        bgGradient: 'from-cyan-600 to-cyan-800',
        posX: 20,
        posY: 40,
        order: 4,
        difficulty: 'advanced',
        tags: JSON.stringify(['closures', 'scope', 'module-pattern', 'encapsulation']),
        sourceExercises: ['ex08', 'ex09'],
        unlockRequirement: JSON.stringify({ worldSlug: 'fp-valley', minPercent: 60 })
    },
    {
        slug: 'oop-temple',
        name: 'OOP Temple',
        description: 'Prototypes, classes ES6+, héritage, private fields...',
        icon: '🏛️',
        color: 'yellow',
        bgGradient: 'from-yellow-600 to-yellow-800',
        posX: 80,
        posY: 40,
        order: 5,
        difficulty: 'advanced',
        tags: JSON.stringify(['oop', 'prototype', 'class', 'inheritance', 'private-fields']),
        sourceExercises: ['ex10', 'ex11'],
        unlockRequirement: JSON.stringify({ worldSlug: 'async-forest', minPercent: 60 })
    },
    {
        slug: 'meta-tower',
        name: 'Meta Tower',
        description: 'Métaprogrammation et performance : Proxy, Reflect, optimisation V8...',
        icon: '🗼',
        color: 'pink',
        bgGradient: 'from-pink-600 to-pink-800',
        posX: 35,
        posY: 25,
        order: 6,
        difficulty: 'expert',
        tags: JSON.stringify(['proxy', 'reflect', 'metaprogramming', 'performance']),
        sourceExercises: ['ex12', 'ex13'],
        unlockRequirement: JSON.stringify({ worldSlug: 'closures-cave', minPercent: 100 })
    },
    {
        slug: 'itmade-arena',
        name: 'Itmade Arena',
        description: 'Défis algorithmiques : Two Pointers, Binary Search, DFS/BFS, Dynamic Programming...',
        icon: '⚔️',
        color: 'red',
        bgGradient: 'from-red-600 to-red-800',
        posX: 50,
        posY: 35,
        order: 7,
        difficulty: 'advanced',
        tags: JSON.stringify(['algorithms', 'leetcode', 'patterns', 'data-structures']),
        sourcePath: 'module-leetcode/easy',
        unlockRequirement: JSON.stringify({ worldSlug: 'oop-temple', minPercent: 50 })
    },
    {
        slug: 'summit',
        name: 'Summit',
        description: 'Projet final : Créer un mini-framework réactif style Vue/React !',
        icon: '🏔️',
        color: 'amber',
        bgGradient: 'from-amber-500 to-yellow-600',
        posX: 50,
        posY: 10,
        order: 8,
        difficulty: 'expert',
        tags: JSON.stringify(['project', 'framework', 'reactive', 'final']),
        sourceExercises: ['ex14'],
        unlockRequirement: JSON.stringify({ worldSlug: 'meta-tower', minPercent: 100 })
    }
];

interface LevelData {
    slug: string;
    worldSlug: string;
    title: string;
    statement: string;
    starterCode: string;
    testCode: string;
    solution: string;
    order: number;
    xpReward: number;
    maxStars: number;
    difficulty: string;
    tags: string;
    hints: string;
}

function parseExercise(exercisePath: string, worldSlug: string, order: number): LevelData | null {
    const readmePath = path.join(exercisePath, 'README.md');
    const indexPath = path.join(exercisePath, 'index.js');
    const testPath = path.join(exercisePath, 'test.js');

    if (!fs.existsSync(readmePath)) {
        console.warn(`  ⚠️ README.md manquant: ${exercisePath}`);
        return null;
    }

    const readme = fs.readFileSync(readmePath, 'utf-8');
    const indexJs = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8') : '';
    const testJs = fs.existsSync(testPath) ? fs.readFileSync(testPath, 'utf-8') : '';

    // Extract title from README
    const titleMatch = readme.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].replace(/^Ex\d+\s*-\s*/, '').trim() : path.basename(exercisePath);

    // Extract slug from folder name
    const folderName = path.basename(exercisePath);
    const slug = `${worldSlug}-${folderName}`;

    // Determine difficulty based on world
    const difficultyMap: Record<string, string> = {
        'fondations': 'beginner',
        'fp-valley': 'intermediate',
        'async-forest': 'intermediate',
        'closures-cave': 'advanced',
        'oop-temple': 'advanced',
        'meta-tower': 'expert',
        'itmade-arena': 'advanced',
        'summit': 'expert'
    };

    // XP based on difficulty
    const xpMap: Record<string, number> = {
        'beginner': 50,
        'intermediate': 100,
        'advanced': 150,
        'expert': 250
    };

    const difficulty = difficultyMap[worldSlug] || 'intermediate';
    const xpReward = xpMap[difficulty];

    return {
        slug,
        worldSlug,
        title,
        statement: readme,
        starterCode: indexJs,
        testCode: testJs,
        solution: '', // Solutions are kept private
        order,
        xpReward,
        maxStars: 3,
        difficulty,
        tags: JSON.stringify([]),
        hints: JSON.stringify([])
    };
}

function parseLeetcodeExercise(filePath: string, worldSlug: string, order: number): LevelData | null {
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.js');

    // Extract title from file name (e.g., "01-two-sum.js" -> "Two Sum")
    const titlePart = fileName.replace(/^\d+-/, '');
    const title = titlePart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Try to extract problem description from comments
    const descMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    const description = descMatch ? descMatch[0] : `Résoudre le problème "${title}"`;

    // Create statement from the file content (using first major comment block)
    const statement = `# ${title}\n\n${description}\n\n## Code\n\nVoir le fichier source pour les détails.`;

    return {
        slug: `${worldSlug}-${fileName}`,
        worldSlug,
        title,
        statement,
        starterCode: `// ${title}\n// Implémentez votre solution ici\n\nfunction solution() {\n    // Votre code ici\n}\n\nmodule.exports = { solution };`,
        testCode: content, // The file contains tests
        solution: '',
        order,
        xpReward: 150,
        maxStars: 3,
        difficulty: 'advanced',
        tags: JSON.stringify(['algorithm', 'problem-solving']),
        hints: JSON.stringify([])
    };
}

async function syncWorlds() {
    console.log('\n📍 Synchronisation des Mondes...\n');

    for (const worldConfig of WORLDS_CONFIG) {
        const { sourcePath, sourceExercises, ...worldData } = worldConfig;

        // Count levels for this world
        let totalLevels = 0;
        if (sourcePath) {
            const fullPath = path.join(PISCINE_PATH, sourcePath);
            if (fs.existsSync(fullPath)) {
                const items = fs.readdirSync(fullPath);
                totalLevels = items.filter(item => {
                    const itemPath = path.join(fullPath, item);
                    return fs.statSync(itemPath).isDirectory() && item.startsWith('ex');
                }).length;
                // For leetcode, count .js files
                if (totalLevels === 0) {
                    totalLevels = items.filter(item => item.endsWith('.js')).length;
                }
            }
        } else if (sourceExercises) {
            totalLevels = sourceExercises.length;
        }

        const documentData = {
            ...worldData,
            totalLevels,
            unlockRequirement: worldData.unlockRequirement || ''
        };

        // Check if world exists
        try {
            const existing = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                JS_WORLDS_COLLECTION_ID,
                [Query.equal('slug', worldData.slug), Query.limit(1)]
            );

            if (existing.documents.length > 0) {
                console.log(`  🔄 Mise à jour: ${worldData.name}`);
                await databases.updateDocument(
                    APPWRITE_DATABASE_ID,
                    JS_WORLDS_COLLECTION_ID,
                    existing.documents[0].$id,
                    documentData
                );
            } else {
                console.log(`  ✨ Création: ${worldData.name}`);
                await databases.createDocument(
                    APPWRITE_DATABASE_ID,
                    JS_WORLDS_COLLECTION_ID,
                    ID.unique(),
                    documentData
                );
            }
        } catch (error) {
            console.error(`  ❌ Erreur pour ${worldData.name}:`, error);
        }
    }
}

async function syncLevels() {
    console.log('\n📚 Synchronisation des Niveaux...\n');

    for (const worldConfig of WORLDS_CONFIG) {
        console.log(`\n🌍 ${worldConfig.name}:`);

        const levels: LevelData[] = [];

        if (worldConfig.sourcePath) {
            // Parse directory (module-0 or module-leetcode/easy)
            const fullPath = path.join(PISCINE_PATH, worldConfig.sourcePath);
            if (!fs.existsSync(fullPath)) {
                console.log(`  ⚠️ Chemin non trouvé: ${fullPath}`);
                continue;
            }

            const items = fs.readdirSync(fullPath).sort();

            if (worldConfig.slug === 'itmade-arena') {
                // Parse .js files for leetcode
                let order = 1;
                for (const item of items) {
                    if (item.endsWith('.js')) {
                        const level = parseLeetcodeExercise(
                            path.join(fullPath, item),
                            worldConfig.slug,
                            order++
                        );
                        if (level) levels.push(level);
                    }
                }
            } else {
                // Parse ex## directories
                let order = 1;
                for (const item of items) {
                    if (item.startsWith('ex')) {
                        const level = parseExercise(
                            path.join(fullPath, item),
                            worldConfig.slug,
                            order++
                        );
                        if (level) levels.push(level);
                    }
                }
            }
        } else if (worldConfig.sourceExercises) {
            // Parse specific exercises from root
            let order = 1;
            for (const exName of worldConfig.sourceExercises) {
                const level = parseExercise(
                    path.join(PISCINE_PATH, exName),
                    worldConfig.slug,
                    order++
                );
                if (level) levels.push(level);
            }
        }

        // Sync levels to database
        for (const level of levels) {
            try {
                const existing = await databases.listDocuments(
                    APPWRITE_DATABASE_ID,
                    JS_LEVELS_COLLECTION_ID,
                    [Query.equal('slug', level.slug), Query.limit(1)]
                );

                if (existing.documents.length > 0) {
                    console.log(`    🔄 ${level.title}`);
                    await databases.updateDocument(
                        APPWRITE_DATABASE_ID,
                        JS_LEVELS_COLLECTION_ID,
                        existing.documents[0].$id,
                        level
                    );
                } else {
                    console.log(`    ✨ ${level.title}`);
                    await databases.createDocument(
                        APPWRITE_DATABASE_ID,
                        JS_LEVELS_COLLECTION_ID,
                        ID.unique(),
                        level
                    );
                }
            } catch (error) {
                console.error(`    ❌ Erreur pour ${level.title}:`, error);
            }
        }

        console.log(`  → ${levels.length} niveaux synchronisés`);
    }
}

async function main() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║    SYNC JS WORLDMAP - PISCINE EXPERT   ║');
    console.log('╚════════════════════════════════════════╝');

    await syncWorlds();
    await syncLevels();

    console.log('\n✅ Synchronisation terminée !');
}

main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
});
