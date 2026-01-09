import { Client, Databases, ID, Query } from 'node-appwrite';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Correction pour __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const GITHUB_REPO_URL = 'https://github.com/p4cm4n972/piscine-C.git';
const LOCAL_REPO_PATH = path.join(__dirname, 'piscine-C');

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = 'codebog-db';
const C_EXERCISES_COLLECTION_ID = 'c-exercises';

// --- Validation des variables d'environnement ---
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    process.exit(1);
}

// --- Initialisation des clients ---
const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);
const git = simpleGit();

// --- Interfaces ---
interface ParsedExercise {
    slug: string;
    title: string;
    week: string;
    day: string;
    statement: string;
    starterCode: string;
    testCode: string;
    solution: string;
    order: number;
}

// --- Fonctions de parsing ---

/**
 * Extrait le titre de l'exercice depuis le header du fichier C
 */
function extractTitle(content: string): string {
    // Cherche la ligne "Exercice : xxx"
    const match = content.match(/Exercice\s*:\s*(.+)/);
    if (match) {
        // Nettoie les marqueurs de commentaires et espaces
        return match[1]
            .replace(/\*+\/?/g, '')  // Retire */ ou ** ou *
            .replace(/\/\*/g, '')     // Retire /*
            .trim();
    }
    return 'Exercice C';
}

/**
 * Extrait l'énoncé (statement) depuis les commentaires
 */
function extractStatement(content: string): string {
    const lines = content.split('\n');
    let inStatement = false;
    let statement: string[] = [];

    for (const line of lines) {
        // Début de l'énoncé
        if (line.includes('ÉNONCÉ') || line.includes('ENONCE')) {
            inStatement = true;
            statement.push('## Objectif\n');
            continue;
        }

        // Détection de la fin de l'énoncé (début du code réel)
        if (inStatement) {
            // Arrêter avant le code de fonction (non commenté)
            if (!line.trim().startsWith('**') && !line.trim().startsWith('/*') && !line.trim().startsWith('*')) {
                // Ligne de code réel (pas un commentaire)
                if (line.match(/^(int|void|char|long|short|unsigned|float|double|static)\s+\w+/)) {
                    break;
                }
                if (line.match(/^#include/)) {
                    break;
                }
            }

            // Extraire le contenu des commentaires
            let cleanLine = line
                .replace(/^\s*\*\*\s?/, '')  // Retire ** au début
                .replace(/^\s*\*\s?/, '')     // Retire * au début
                .replace(/^\s*\/\*\s?/, '')   // Retire /* au début
                .replace(/\s*\*\/\s*$/, '');  // Retire */ à la fin

            // Transformer les sections en markdown
            if (cleanLine.includes('EXEMPLES')) {
                cleanLine = '\n## Exemples\n';
            } else if (cleanLine.includes('CONTRAINTES')) {
                cleanLine = '\n## Contraintes\n';
            } else if (cleanLine.includes('COMPORTEMENT')) {
                cleanLine = '\n## Comportement\n';
            } else if (cleanLine.includes('Prototype')) {
                cleanLine = '\n### Prototype\n```c\n' + cleanLine.replace('Prototype :', '').trim() + '\n```\n';
            } else if (cleanLine.match(/^\s*-\s/)) {
                // Liste à puces
                cleanLine = cleanLine;
            } else if (cleanLine.match(/^\w+\([^)]*\)\s*(→|->|=)/)) {
                // Exemple de fonction
                cleanLine = '- `' + cleanLine.replace(/→|->/, '→').trim() + '`';
            }

            statement.push(cleanLine);
        }
    }

    return statement.join('\n').trim();
}

/**
 * Extrait le prototype de fonction comme code de départ
 */
function extractStarterCode(content: string): string {
    // Cherche le prototype dans l'énoncé
    const prototypeMatch = content.match(/Prototype\s*:\s*([^;]+;)/);
    if (prototypeMatch) {
        const prototype = prototypeMatch[1].trim();
        // Génère un squelette de fonction
        const funcMatch = prototype.match(/(\w+)\s+(\w+)\s*\(([^)]*)\)/);
        if (funcMatch) {
            const [, returnType, funcName, params] = funcMatch;
            return `${returnType}\t${funcName}(${params})
{
\t// Votre code ici
\treturn (${returnType === 'void' ? '' : '0'});
}
`;
        }
    }
    return '// Écrivez votre code ici\n';
}

/**
 * Extrait le code de test depuis les commentaires
 */
function extractTestCode(content: string): string {
    const lines = content.split('\n');
    let inTests = false;
    let testCode: string[] = [];

    for (const line of lines) {
        // Début des tests
        if (line.includes('TESTS') && line.includes('**')) {
            inTests = true;
            continue;
        }

        if (inTests) {
            // Fin des tests (nouveau bloc de commentaires ou fin de fichier)
            if (line.includes('COMPILATION') || line.includes('SORTIE ATTENDUE') ||
                (line.trim() === '*/' && testCode.length > 0)) {
                break;
            }

            // Extraire le code des commentaires
            let cleanLine = line
                .replace(/^\s*\*\*\s?/, '')
                .replace(/^\s*\*\s?/, '')
                .replace(/^\s*\/\*\s?/, '')
                .replace(/\s*\*\/\s*$/, '');

            if (cleanLine.trim()) {
                testCode.push(cleanLine);
            }
        }
    }

    return testCode.join('\n').trim();
}

/**
 * Extrait le code solution (la fonction implémentée)
 */
function extractSolution(content: string): string {
    const lines = content.split('\n');
    let inFunction = false;
    let braceCount = 0;
    let solution: string[] = [];

    for (const line of lines) {
        // Détecte le début d'une fonction (type + nom + parenthèses)
        if (!inFunction && line.match(/^(int|void|char|long|short|unsigned|float|double|static)\s+\w+\s*\([^)]*\)\s*$/)) {
            inFunction = true;
            solution.push(line);
            continue;
        }

        if (inFunction) {
            solution.push(line);

            // Compte les accolades
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;

            // Fin de la fonction
            if (braceCount === 0 && line.includes('}')) {
                break;
            }
        }
    }

    return solution.join('\n').trim();
}

/**
 * Parse un fichier C d'exercice et extrait les informations
 */
async function parseExerciseFile(filePath: string, week: string, day: string, order: number): Promise<ParsedExercise | null> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const filename = path.basename(filePath, '.c');

        // Slug basé sur le nom du fichier
        const slug = filename.replace(/^(ex\d+_|challenge_)/, '');

        const title = extractTitle(content);
        const statement = extractStatement(content);
        const starterCode = extractStarterCode(content);
        const testCode = extractTestCode(content);
        const solution = extractSolution(content);

        return {
            slug,
            title,
            week,
            day,
            statement,
            starterCode,
            testCode,
            solution,
            order,
        };
    } catch (err) {
        console.error(`Erreur lors du parsing de ${filePath}:`, err);
        return null;
    }
}

// --- Fonctions de synchronisation ---

async function syncRepo() {
    console.log(`Synchronisation du dépôt depuis ${GITHUB_REPO_URL}...`);
    const stats = await fs.stat(LOCAL_REPO_PATH).catch(() => null);

    if (stats && stats.isDirectory()) {
        await git.cwd(LOCAL_REPO_PATH);
        await git.pull();
        console.log('Dépôt mis à jour avec succès.');
    } else {
        await git.clone(GITHUB_REPO_URL, LOCAL_REPO_PATH);
        console.log('Dépôt cloné avec succès.');
    }
}

async function findExerciseFiles(): Promise<{ path: string; week: string; day: string; order: number }[]> {
    const exercises: { path: string; week: string; day: string; order: number }[] = [];
    let globalOrder = 0;

    // Parcourir les semaines
    const weeks = await fs.readdir(LOCAL_REPO_PATH);
    const weekDirs = weeks.filter(w => w.startsWith('Semaine')).sort();

    for (const weekDir of weekDirs) {
        const weekPath = path.join(LOCAL_REPO_PATH, weekDir);
        const weekStats = await fs.stat(weekPath);

        if (!weekStats.isDirectory()) continue;

        // Parcourir les jours
        const days = await fs.readdir(weekPath);
        const dayDirs = days.filter(d => d.startsWith('jour')).sort();

        for (const dayDir of dayDirs) {
            const dayPath = path.join(weekPath, dayDir);
            const dayStats = await fs.stat(dayPath);

            if (!dayStats.isDirectory()) continue;

            // Trouver les fichiers d'exercices
            const files = await fs.readdir(dayPath);
            const exerciseFiles = files
                .filter(f => f.endsWith('.c') && (f.startsWith('ex') || f.startsWith('challenge')))
                .sort();

            for (const file of exerciseFiles) {
                exercises.push({
                    path: path.join(dayPath, file),
                    week: weekDir,
                    day: dayDir,
                    order: globalOrder++,
                });
            }
        }
    }

    return exercises;
}

async function syncExercises() {
    console.log('Début de la synchronisation des exercices C...');

    const exerciseFiles = await findExerciseFiles();
    console.log(`Trouvé ${exerciseFiles.length} fichiers d'exercices.`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const { path: filePath, week, day, order } of exerciseFiles) {
        const exercise = await parseExerciseFile(filePath, week, day, order);

        if (!exercise) {
            errors++;
            continue;
        }

        try {
            // Vérifier si l'exercice existe déjà
            const existingDocs = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                C_EXERCISES_COLLECTION_ID,
                [Query.equal('slug', exercise.slug)]
            );

            const data = {
                slug: exercise.slug,
                title: exercise.title,
                week: exercise.week,
                day: exercise.day,
                statement: exercise.statement,
                starterCode: exercise.starterCode,
                testCode: exercise.testCode,
                solution: exercise.solution,
                order: exercise.order,
            };

            if (existingDocs.total > 0) {
                const docId = existingDocs.documents[0].$id;
                await databases.updateDocument(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, docId, data);
                console.log(`[UPDATE] ${exercise.slug} (${exercise.week}/${exercise.day})`);
                updated++;
            } else {
                await databases.createDocument(APPWRITE_DATABASE_ID, C_EXERCISES_COLLECTION_ID, ID.unique(), data);
                console.log(`[CREATE] ${exercise.slug} (${exercise.week}/${exercise.day})`);
                created++;
            }
        } catch (err) {
            console.error(`Erreur pour ${exercise.slug}:`, err);
            errors++;
        }
    }

    console.log(`\nRésumé: ${created} créés, ${updated} mis à jour, ${errors} erreurs`);
}

async function main() {
    console.log('--- DÉBUT DU SCRIPT DE SYNCHRONISATION C ---');
    await syncRepo();
    await syncExercises();
    console.log('--- FIN DU SCRIPT DE SYNCHRONISATION ---');
}

main().catch(error => {
    console.error('Une erreur inattendue est survenue :', error);
    process.exit(1);
});
