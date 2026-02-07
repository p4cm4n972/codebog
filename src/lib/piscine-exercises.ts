/**
 * Service pour charger les exercices depuis les fichiers piscine-js
 * Ces fichiers sont stockés dans scripts/piscine-js-*
 */

import fs from 'fs';
import path from 'path';

export interface PiscineExercise {
  index: number;
  slug: string;
  title: string;
  statement: string;
  starterCode: string;
  testCode: string;
}

// Mapping entre les slugs de saison et les dossiers piscine
const SEASON_TO_PISCINE: Record<string, string> = {
  'chrono': 'piscine-js-expert',
  'abyss': 'piscine-js-ydkjs',
  'forge': 'piscine-js-good-parts',
  'realm': 'piscine-js-browser'
};

// Mapping spécial pour les modules de JS Chrono (expert) qui ont une structure différente
// Les exercices ex00-ex25 sont à la racine, pas dans des sous-dossiers de module
const CHRONO_MODULE_RANGES: Record<string, [number, number]> = {
  'fundamentals': [0, 9],
  'structures': [10, 17],
  'async': [18, 25],
  'patterns': [26, 35] // Note: pas encore créé dans piscine-js-expert
};

/**
 * Obtient le chemin du dossier piscine pour une saison
 */
function getPiscinePath(seasonSlug: string): string {
  const piscineName = SEASON_TO_PISCINE[seasonSlug];
  if (!piscineName) {
    throw new Error(`Unknown season: ${seasonSlug}`);
  }
  return path.join(process.cwd(), 'scripts', piscineName);
}

/**
 * Extrait le titre depuis le README.md
 * Format attendu: "# Ex00 - Hello JavaScript" -> "Hello JavaScript"
 */
function extractTitle(readme: string): string {
  // Chercher le pattern "# ExXX - Titre"
  const match = readme.match(/^#\s+Ex\d+\s*-\s*(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  // Fallback: prendre tout après le premier #
  const firstHeader = readme.match(/^#\s+(.+)$/m);
  if (firstHeader) {
    // Si le titre contient un tiret, prendre la partie après
    const parts = firstHeader[1].split(' - ');
    return parts.length > 1 ? parts.slice(1).join(' - ').trim() : firstHeader[1].trim();
  }
  return 'Exercice';
}

/**
 * Charge un exercice depuis son dossier
 */
function loadExercise(exercisePath: string, index: number, moduleSlug: string): PiscineExercise | null {
  try {
    const readmePath = path.join(exercisePath, 'README.md');
    const indexPath = path.join(exercisePath, 'index.js');
    const testPath = path.join(exercisePath, 'test.js');

    if (!fs.existsSync(readmePath)) {
      return null;
    }

    const statement = fs.readFileSync(readmePath, 'utf-8');
    const starterCode = fs.existsSync(indexPath)
      ? fs.readFileSync(indexPath, 'utf-8')
      : '// Write your code here';
    const testCode = fs.existsSync(testPath)
      ? fs.readFileSync(testPath, 'utf-8')
      : '';

    const title = extractTitle(statement);
    const exNumber = path.basename(exercisePath).replace('ex', '');

    return {
      index,
      slug: `${moduleSlug}-ex${exNumber}`,
      title,
      statement,
      starterCode,
      testCode
    };
  } catch (error) {
    console.error(`Error loading exercise from ${exercisePath}:`, error);
    return null;
  }
}

/**
 * Charge tous les exercices d'un module
 */
export function loadModuleExercises(seasonSlug: string, moduleSlug: string): PiscineExercise[] {
  const piscinePath = getPiscinePath(seasonSlug);
  const exercises: PiscineExercise[] = [];

  // Cas spécial pour JS Chrono (piscine-js-expert): exercices à la racine
  if (seasonSlug === 'chrono') {
    const range = CHRONO_MODULE_RANGES[moduleSlug];
    if (!range) {
      console.error(`Unknown module for chrono: ${moduleSlug}`);
      return [];
    }

    const [start, end] = range;
    for (let i = start; i <= end; i++) {
      const exFolder = `ex${i.toString().padStart(2, '0')}`;
      const exercisePath = path.join(piscinePath, exFolder);

      if (fs.existsSync(exercisePath)) {
        const exercise = loadExercise(exercisePath, i - start, moduleSlug);
        if (exercise) {
          exercises.push(exercise);
        }
      }
    }
  } else {
    // Autres saisons: exercices dans des sous-dossiers par module
    const modulePath = path.join(piscinePath, moduleSlug);

    if (!fs.existsSync(modulePath)) {
      console.error(`Module path not found: ${modulePath}`);
      return [];
    }

    // Lister les dossiers ex00, ex01, etc.
    const entries = fs.readdirSync(modulePath, { withFileTypes: true });
    const exFolders = entries
      .filter(e => e.isDirectory() && e.name.startsWith('ex'))
      .map(e => e.name)
      .sort((a, b) => {
        const numA = parseInt(a.replace('ex', ''));
        const numB = parseInt(b.replace('ex', ''));
        return numA - numB;
      });

    exFolders.forEach((folder, index) => {
      const exercisePath = path.join(modulePath, folder);
      const exercise = loadExercise(exercisePath, index, moduleSlug);
      if (exercise) {
        exercises.push(exercise);
      }
    });
  }

  return exercises;
}

/**
 * Charge un exercice spécifique par son slug
 */
export function loadExerciseBySlug(seasonSlug: string, moduleSlug: string, exerciseSlug: string): PiscineExercise | null {
  const exercises = loadModuleExercises(seasonSlug, moduleSlug);
  return exercises.find(ex => ex.slug === exerciseSlug) || null;
}

/**
 * Vérifie si le dossier piscine existe pour une saison
 */
export function piscineExists(seasonSlug: string): boolean {
  try {
    const piscinePath = getPiscinePath(seasonSlug);
    return fs.existsSync(piscinePath);
  } catch {
    return false;
  }
}

/**
 * Liste les modules disponibles dans une piscine
 */
export function listAvailableModules(seasonSlug: string): string[] {
  try {
    const piscinePath = getPiscinePath(seasonSlug);

    if (seasonSlug === 'chrono') {
      // Pour chrono, on retourne les modules configurés
      return Object.keys(CHRONO_MODULE_RANGES);
    }

    // Pour les autres, on liste les dossiers
    const entries = fs.readdirSync(piscinePath, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('node_modules'))
      .map(e => e.name);
  } catch {
    return [];
  }
}
