/**
 * Service pour charger les exercices depuis Appwrite (saison chrono)
 * ou depuis le filesystem (autres saisons trackées en git).
 */

import fs from 'fs';
import path from 'path';
import { getAdminDatabases, DATABASE_ID } from './appwrite-admin';
import { Query } from 'node-appwrite';

export interface PiscineExercise {
  index: number;
  slug: string;
  title: string;
  statement: string;
  starterCode: string;
  testCode: string;
}

// Saisons lues depuis le filesystem (fichiers trackés en git)
const SEASON_TO_PISCINE: Record<string, string> = {
  'abyss': 'piscine-js-ydkjs',
  'forge': 'piscine-js-good-parts',
  'realm': 'piscine-js-browser'
};

// Chrono : plages d'exercices par module dans la collection Appwrite 'exercises'
// Les slugs Appwrite sont ex00..ex25, répartis par module
const CHRONO_MODULE_RANGES: Record<string, [number, number]> = {
  'fundamentals': [0, 9],
  'structures': [10, 17],
  'async': [18, 25],
  'patterns': [26, 35]
};

const EXERCISES_COLLECTION = 'exercises';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extrait le titre depuis le README.md
 * Format attendu: "# Ex00 - Hello JavaScript" -> "Hello JavaScript"
 */
function extractTitle(readme: string): string {
  const match = readme.match(/^#\s+Ex\d+\s*-\s*(.+)$/m);
  if (match) return match[1].trim();
  const firstHeader = readme.match(/^#\s+(.+)$/m);
  if (firstHeader) {
    const parts = firstHeader[1].split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ').trim() : firstHeader[1].trim();
  }
  return 'Exercice';
}

/**
 * Charge un exercice depuis son dossier (filesystem)
 */
function loadExerciseFromFs(exercisePath: string, index: number, moduleSlug: string): PiscineExercise | null {
  try {
    const readmePath = path.join(exercisePath, 'README.md');
    const indexPath = path.join(exercisePath, 'index.js');
    const testPath = path.join(exercisePath, 'test.js');

    if (!fs.existsSync(readmePath)) return null;

    const statement = fs.readFileSync(readmePath, 'utf-8');
    const starterCode = fs.existsSync(indexPath)
      ? fs.readFileSync(indexPath, 'utf-8')
      : '// Write your code here';
    const testCode = fs.existsSync(testPath)
      ? fs.readFileSync(testPath, 'utf-8')
      : '';

    const exNumber = path.basename(exercisePath).replace('ex', '');

    return {
      index,
      slug: `${moduleSlug}-ex${exNumber}`,
      title: extractTitle(statement),
      statement,
      starterCode,
      testCode,
    };
  } catch (error) {
    console.error(`Error loading exercise from ${exercisePath}:`, error);
    return null;
  }
}

// ============================================================================
// CHRONO — lecture depuis Appwrite
// ============================================================================

interface AppwriteExerciseDoc {
  slug: string;
  title: string;
  statement: string;
  starterCode: string;
  testCode: string;
}

async function loadChronoExercisesFromAppwrite(moduleSlug: string): Promise<PiscineExercise[]> {
  const range = CHRONO_MODULE_RANGES[moduleSlug];
  if (!range) {
    console.error(`Unknown chrono module: ${moduleSlug}`);
    return [];
  }

  const [start, end] = range;
  const appwriteSlugs: string[] = [];
  for (let i = start; i <= end; i++) {
    appwriteSlugs.push(`ex${i.toString().padStart(2, '0')}`);
  }

  try {
    const databases = getAdminDatabases();
    const response = await databases.listDocuments(DATABASE_ID, EXERCISES_COLLECTION, [
      Query.equal('slug', appwriteSlugs),
      Query.orderAsc('slug'),
      Query.limit(100),
    ]);

    return response.documents.map((doc, localIndex) => {
      const d = doc as unknown as AppwriteExerciseDoc;
      return {
        index: localIndex,
        slug: `${moduleSlug}-${d.slug}`,   // e.g. "fundamentals-ex00"
        title: extractTitle(d.statement) || d.title,
        statement: d.statement || '',
        starterCode: d.starterCode || '// Write your code here',
        testCode: d.testCode || '',
      };
    });
  } catch (error) {
    console.error('Error loading chrono exercises from Appwrite:', error);
    return [];
  }
}

// ============================================================================
// API PUBLIQUE
// ============================================================================

/**
 * Charge tous les exercices d'un module.
 * - Saison 'chrono' : lit depuis Appwrite (collection 'exercises')
 * - Autres saisons  : lit depuis le filesystem (fichiers trackés en git)
 */
export async function loadModuleExercises(
  seasonSlug: string,
  moduleSlug: string
): Promise<PiscineExercise[]> {
  if (seasonSlug === 'chrono') {
    return loadChronoExercisesFromAppwrite(moduleSlug);
  }

  // Filesystem pour les autres saisons
  const piscineName = SEASON_TO_PISCINE[seasonSlug];
  if (!piscineName) {
    console.error(`Unknown season: ${seasonSlug}`);
    return [];
  }

  const piscinePath = path.join(process.cwd(), 'scripts', piscineName);
  const modulePath = path.join(piscinePath, moduleSlug);

  if (!fs.existsSync(modulePath)) {
    console.error(`Module path not found: ${modulePath}`);
    return [];
  }

  const entries = fs.readdirSync(modulePath, { withFileTypes: true });
  const exFolders = entries
    .filter(e => e.isDirectory() && e.name.startsWith('ex'))
    .map(e => e.name)
    .sort((a, b) => parseInt(a.replace('ex', '')) - parseInt(b.replace('ex', '')));

  const exercises: PiscineExercise[] = [];
  exFolders.forEach((folder, index) => {
    const ex = loadExerciseFromFs(path.join(modulePath, folder), index, moduleSlug);
    if (ex) exercises.push(ex);
  });

  return exercises;
}

/**
 * Charge un exercice spécifique par son slug.
 * Délègue à loadModuleExercises puis filtre.
 */
export async function loadExerciseBySlug(
  seasonSlug: string,
  moduleSlug: string,
  exerciseSlug: string
): Promise<PiscineExercise | null> {
  const exercises = await loadModuleExercises(seasonSlug, moduleSlug);
  return exercises.find(ex => ex.slug === exerciseSlug) ?? null;
}

/**
 * Vérifie si le dossier piscine existe pour une saison (filesystem uniquement)
 */
export function piscineExists(seasonSlug: string): boolean {
  if (seasonSlug === 'chrono') return true; // Appwrite toujours disponible
  try {
    const piscineName = SEASON_TO_PISCINE[seasonSlug];
    if (!piscineName) return false;
    return fs.existsSync(path.join(process.cwd(), 'scripts', piscineName));
  } catch {
    return false;
  }
}

/**
 * Liste les modules disponibles dans une piscine
 */
export function listAvailableModules(seasonSlug: string): string[] {
  if (seasonSlug === 'chrono') {
    return Object.keys(CHRONO_MODULE_RANGES);
  }
  try {
    const piscineName = SEASON_TO_PISCINE[seasonSlug];
    if (!piscineName) return [];
    const piscinePath = path.join(process.cwd(), 'scripts', piscineName);
    const entries = fs.readdirSync(piscinePath, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
      .map(e => e.name);
  } catch {
    return [];
  }
}
