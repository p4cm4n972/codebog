/**
 * Configuration des 4 saisons JavaScript pour CodeBog
 * Chaque saison contient des modules (worlds) avec des exercices (levels)
 */

export interface JsSeason {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  theme: string;
  world: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
  images: {
    banner: string;
    worldmap: string;
  };
  modules: JsModule[];
  totalExercises: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  order: number;
  /** Nombre de mois après le lancement pour débloquer cette saison */
  unlockAfterMonths: number;
}

// =============================================================================
// CONFIGURATION DU DÉBLOCAGE PROGRESSIF
// =============================================================================

/**
 * Date de lancement officiel de JSBOG
 * Les saisons se débloquent progressivement à partir de cette date
 */
export const JSBOG_LAUNCH_DATE = new Date('2026-02-01T00:00:00Z');

/**
 * Intervalle entre chaque déblocage de saison (en mois)
 */
export const SEASON_UNLOCK_INTERVAL_MONTHS = 4;

export interface JsModule {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  exerciseRange: [number, number]; // [start, end] ex: [0, 5]
  exerciseCount: number;
  topics: string[];
}

// =============================================================================
// SAISON 1: JS Chrono - Le Nexus Temporel
// =============================================================================
const SEASON_CHRONO: JsSeason = {
  id: 'js-chrono',
  slug: 'chrono',
  name: 'JS Chrono',
  subtitle: 'Le Nexus Temporel',
  description: 'Maîtrisez ES6+, l\'asynchrone et les patterns avancés dans une cité flottante où le temps s\'écoule différemment.',
  theme: 'Nexus Temporel',
  world: 'Cité flottante futuriste, manipulation du temps',
  colors: {
    primary: '#00D4FF',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    gradient: 'from-cyan-500 via-blue-600 to-purple-700'
  },
  images: {
    banner: '/images/curriculum/banners/expert-banner.png',
    worldmap: '/images/curriculum/worldmaps/expert-worldmap.png'
  },
  modules: [
    {
      id: 'expert-fundamentals',
      slug: 'fundamentals',
      name: 'Fondamentaux',
      description: 'Variables, types, opérateurs et structures de base ES6+',
      icon: '/images/curriculum/icons/expert-mod-fundamentals.png',
      exerciseRange: [0, 9],
      exerciseCount: 10,
      topics: ['let/const', 'template literals', 'destructuring', 'spread operator']
    },
    {
      id: 'expert-structures',
      slug: 'structures',
      name: 'Structures Avancées',
      description: 'Map, Set, WeakMap, et structures de données complexes',
      icon: '/images/curriculum/icons/expert-mod-structures.png',
      exerciseRange: [10, 17],
      exerciseCount: 8,
      topics: ['Map', 'Set', 'WeakMap', 'WeakSet', 'iterators']
    },
    {
      id: 'expert-async',
      slug: 'async',
      name: 'Async & Promises',
      description: 'Promesses, async/await et gestion du flux asynchrone',
      icon: '/images/curriculum/icons/expert-mod-async.png',
      exerciseRange: [18, 25],
      exerciseCount: 8,
      topics: ['Promises', 'async/await', 'Promise.all', 'error handling']
    },
    {
      id: 'expert-patterns',
      slug: 'patterns',
      name: 'Design Patterns',
      description: 'Patterns de conception et architectures modulaires',
      icon: '/images/curriculum/icons/expert-mod-patterns.png',
      exerciseRange: [26, 35],
      exerciseCount: 10,
      topics: ['Module', 'Factory', 'Observer', 'Singleton']
    }
  ],
  totalExercises: 36,
  difficulty: 'Avancé',
  order: 1,
  unlockAfterMonths: 0 // Disponible immédiatement
};

// =============================================================================
// SAISON 2: JS Abyss - Les Profondeurs Abyssales
// =============================================================================
const SEASON_ABYSS: JsSeason = {
  id: 'js-abyss',
  slug: 'abyss',
  name: 'JS Abyss',
  subtitle: 'Les Profondeurs Abyssales',
  description: 'Explorez les fondations cachées de JavaScript dans un océan mystique à plusieurs niveaux de profondeur.',
  theme: 'Profondeurs Abyssales',
  world: 'Océan mystique sous-marin, exploration des fondations',
  colors: {
    primary: '#14B8A6',
    secondary: '#1E3A5F',
    accent: '#7DD3FC',
    gradient: 'from-teal-500 via-cyan-600 to-blue-800'
  },
  images: {
    banner: '/images/curriculum/banners/ydkjs-banner.png',
    worldmap: '/images/curriculum/worldmaps/ydkjs-worldmap.png'
  },
  modules: [
    {
      id: 'ydkjs-welcome',
      slug: 'welcome-valley',
      name: 'Welcome Valley',
      description: 'Introduction et premiers pas dans les profondeurs',
      icon: '/images/curriculum/icons/ydkjs-mod-welcome.png',
      exerciseRange: [0, 9],
      exerciseCount: 10,
      topics: ['Introduction', 'Setup', 'First steps']
    },
    {
      id: 'ydkjs-primitives',
      slug: 'primitives-lab',
      name: 'Primitives Lab',
      description: 'Types primitifs et coercion en JavaScript',
      icon: '/images/curriculum/icons/ydkjs-mod-primitives.png',
      exerciseRange: [10, 17],
      exerciseCount: 8,
      topics: ['Types', 'Coercion', 'typeof', 'Equality']
    },
    {
      id: 'ydkjs-scope',
      slug: 'scope-tower',
      name: 'Scope Tower',
      description: 'Portée des variables et hoisting',
      icon: '/images/curriculum/icons/ydkjs-mod-scope.png',
      exerciseRange: [18, 24],
      exerciseCount: 7,
      topics: ['Scope', 'Hoisting', 'let vs var', 'Block scope']
    },
    {
      id: 'ydkjs-closures',
      slug: 'closures-cave',
      name: 'Closures Cave',
      description: 'Closures et encapsulation des données',
      icon: '/images/curriculum/icons/ydkjs-mod-closures.png',
      exerciseRange: [25, 32],
      exerciseCount: 8,
      topics: ['Closures', 'Encapsulation', 'Private state', 'IIFE']
    },
    {
      id: 'ydkjs-this',
      slug: 'this-dojo',
      name: 'This Dojo',
      description: 'Le mot-clé this et les contextes d\'exécution',
      icon: '/images/curriculum/icons/ydkjs-mod-this.png',
      exerciseRange: [33, 39],
      exerciseCount: 7,
      topics: ['this', 'call', 'apply', 'bind', 'arrow functions']
    },
    {
      id: 'ydkjs-prototype',
      slug: 'prototype-chain',
      name: 'Prototype Chain',
      description: 'Prototypes et héritage en JavaScript',
      icon: '/images/curriculum/icons/ydkjs-mod-prototype.png',
      exerciseRange: [40, 47],
      exerciseCount: 8,
      topics: ['Prototypes', '__proto__', 'Object.create', 'Inheritance']
    },
    {
      id: 'ydkjs-async-river',
      slug: 'async-river',
      name: 'Async River',
      description: 'Flux asynchrones et event loop',
      icon: '/images/curriculum/icons/ydkjs-mod-async-river.png',
      exerciseRange: [48, 55],
      exerciseCount: 8,
      topics: ['Event loop', 'Callbacks', 'Microtasks', 'Macrotasks']
    },
    {
      id: 'ydkjs-esnext',
      slug: 'es-next-summit',
      name: 'ES.Next Summit',
      description: 'Fonctionnalités modernes ES2020+',
      icon: '/images/curriculum/icons/ydkjs-mod-esnext.png',
      exerciseRange: [56, 61],
      exerciseCount: 6,
      topics: ['Optional chaining', 'Nullish coalescing', 'BigInt', 'Dynamic import']
    }
  ],
  totalExercises: 62,
  difficulty: 'Intermédiaire',
  order: 2,
  unlockAfterMonths: 4 // Juin 2026
};

// =============================================================================
// SAISON 3: JS Forge - La Forge Ancestrale
// =============================================================================
const SEASON_FORGE: JsSeason = {
  id: 'js-forge',
  slug: 'forge',
  name: 'JS Forge',
  subtitle: 'La Forge Ancestrale',
  description: 'Apprenez l\'art de créer avec précision dans une montagne volcanique où les artisans forgent des objets parfaits.',
  theme: 'Forge Ancestrale',
  world: 'Montagne volcanique, forges légendaires',
  colors: {
    primary: '#F97316',
    secondary: '#EAB308',
    accent: '#CD7F32',
    gradient: 'from-orange-500 via-amber-500 to-yellow-600'
  },
  images: {
    banner: '/images/curriculum/banners/goodparts-banner.png',
    worldmap: '/images/curriculum/worldmaps/goodparts-worldmap.png'
  },
  modules: [
    {
      id: 'goodparts-syntax',
      slug: 'good-syntax',
      name: 'Good Syntax',
      description: 'Syntaxe propre et bonnes pratiques de base',
      icon: '/images/curriculum/icons/goodparts-mod-syntax.png',
      exerciseRange: [0, 7],
      exerciseCount: 8,
      topics: ['Whitespace', 'Names', 'Numbers', 'Strings', 'Statements']
    },
    {
      id: 'goodparts-objects',
      slug: 'good-objects',
      name: 'Good Objects',
      description: 'Création et manipulation d\'objets',
      icon: '/images/curriculum/icons/goodparts-mod-objects.png',
      exerciseRange: [8, 18],
      exerciseCount: 11,
      topics: ['Object literals', 'Retrieval', 'Update', 'Reference', 'Prototype']
    },
    {
      id: 'goodparts-functions',
      slug: 'good-functions',
      name: 'Good Functions',
      description: 'Fonctions comme citoyens de première classe',
      icon: '/images/curriculum/icons/goodparts-mod-functions.png',
      exerciseRange: [19, 34],
      exerciseCount: 16,
      topics: ['Function objects', 'Invocation', 'Arguments', 'Return', 'Recursion']
    },
    {
      id: 'goodparts-inheritance',
      slug: 'good-inheritance',
      name: 'Good Inheritance',
      description: 'Patterns d\'héritage et composition',
      icon: '/images/curriculum/icons/goodparts-mod-inheritance.png',
      exerciseRange: [35, 47],
      exerciseCount: 13,
      topics: ['Pseudoclassical', 'Prototypal', 'Functional', 'Parts']
    },
    {
      id: 'goodparts-arrays',
      slug: 'good-arrays',
      name: 'Good Arrays',
      description: 'Tableaux et méthodes de manipulation',
      icon: '/images/curriculum/icons/goodparts-mod-arrays.png',
      exerciseRange: [48, 60],
      exerciseCount: 13,
      topics: ['Array literals', 'Length', 'Delete', 'Enumeration', 'Methods']
    },
    {
      id: 'goodparts-regex',
      slug: 'good-regex',
      name: 'Good Regex',
      description: 'Expressions régulières et pattern matching',
      icon: '/images/curriculum/icons/goodparts-mod-regex.png',
      exerciseRange: [61, 72],
      exerciseCount: 12,
      topics: ['Construction', 'Elements', 'Quantifiers', 'Groups', 'Flags']
    },
    {
      id: 'goodparts-style',
      slug: 'good-style',
      name: 'Good Style',
      description: 'Style de code et beautiful parts',
      icon: '/images/curriculum/icons/goodparts-mod-style.png',
      exerciseRange: [73, 85],
      exerciseCount: 13,
      topics: ['Beautiful features', 'Awful parts', 'Bad parts', 'JSLint']
    }
  ],
  totalExercises: 86,
  difficulty: 'Intermédiaire',
  order: 3,
  unlockAfterMonths: 8 // Octobre 2026
};

// =============================================================================
// SAISON 4: JS Realm - Le Royaume des Interfaces
// =============================================================================
const SEASON_REALM: JsSeason = {
  id: 'js-realm',
  slug: 'realm',
  name: 'JS Realm',
  subtitle: 'Le Royaume des Interfaces',
  description: 'Connectez les mondes visibles dans une métropole magique où les bâtiments sont des fenêtres vers d\'autres dimensions.',
  theme: 'Royaume des Interfaces',
  world: 'Métropole magique, portails dimensionnels',
  colors: {
    primary: '#A78BFA',
    secondary: '#10B981',
    accent: '#FCD34D',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500'
  },
  images: {
    banner: '/images/curriculum/banners/browser-banner.png',
    worldmap: '/images/curriculum/worldmaps/browser-worldmap.png'
  },
  modules: [
    {
      id: 'browser-dombasics',
      slug: 'dom-basics',
      name: 'DOM Basics',
      description: 'Sélection et manipulation du DOM',
      icon: '/images/curriculum/icons/browser-mod-dombasics.png',
      exerciseRange: [0, 5],
      exerciseCount: 6,
      topics: ['querySelector', 'getElementById', 'classList', 'attributes']
    },
    {
      id: 'browser-events',
      slug: 'dom-events',
      name: 'DOM Events',
      description: 'Gestion des événements et interactions',
      icon: '/images/curriculum/icons/browser-mod-events.png',
      exerciseRange: [6, 11],
      exerciseCount: 6,
      topics: ['addEventListener', 'Event object', 'Bubbling', 'Delegation']
    },
    {
      id: 'browser-forms',
      slug: 'dom-forms',
      name: 'DOM Forms',
      description: 'Formulaires et validation',
      icon: '/images/curriculum/icons/browser-mod-forms.png',
      exerciseRange: [12, 16],
      exerciseCount: 5,
      topics: ['Form handling', 'Validation API', 'FormData', 'Submit']
    },
    {
      id: 'browser-async',
      slug: 'dom-async',
      name: 'DOM Async',
      description: 'Fetch API et requêtes HTTP',
      icon: '/images/curriculum/icons/browser-mod-async.png',
      exerciseRange: [17, 22],
      exerciseCount: 6,
      topics: ['Fetch', 'JSON', 'Headers', 'AbortController']
    },
    {
      id: 'browser-storage',
      slug: 'dom-storage',
      name: 'DOM Storage',
      description: 'Stockage navigateur et persistance',
      icon: '/images/curriculum/icons/browser-mod-storage.png',
      exerciseRange: [23, 26],
      exerciseCount: 4,
      topics: ['localStorage', 'sessionStorage', 'IndexedDB', 'Cookies']
    },
    {
      id: 'browser-canvas',
      slug: 'dom-canvas',
      name: 'DOM Canvas',
      description: 'Dessin et animations avec Canvas',
      icon: '/images/curriculum/icons/browser-mod-canvas.png',
      exerciseRange: [27, 31],
      exerciseCount: 5,
      topics: ['Canvas 2D', 'Shapes', 'Animation', 'requestAnimationFrame']
    },
    {
      id: 'browser-projects',
      slug: 'dom-projects',
      name: 'Mini Projects',
      description: 'Projets pratiques combinant toutes les compétences',
      icon: '/images/curriculum/icons/browser-mod-projects.png',
      exerciseRange: [32, 35],
      exerciseCount: 4,
      topics: ['Todo App', 'Weather App', 'Timer', 'Color Picker']
    }
  ],
  totalExercises: 36,
  difficulty: 'Intermédiaire',
  order: 4,
  unlockAfterMonths: 12 // Février 2027
};

// =============================================================================
// EXPORTS
// =============================================================================

export const JS_SEASONS: JsSeason[] = [
  SEASON_CHRONO,
  SEASON_ABYSS,
  SEASON_FORGE,
  SEASON_REALM
];

export const getSeasonBySlug = (slug: string): JsSeason | undefined => {
  return JS_SEASONS.find(s => s.slug === slug);
};

export const getModuleBySlug = (seasonSlug: string, moduleSlug: string): JsModule | undefined => {
  const season = getSeasonBySlug(seasonSlug);
  return season?.modules.find(m => m.slug === moduleSlug);
};

export const getTotalExercises = (): number => {
  return JS_SEASONS.reduce((sum, s) => sum + s.totalExercises, 0);
};

export const getTotalModules = (): number => {
  return JS_SEASONS.reduce((sum, s) => sum + s.modules.length, 0);
};

// =============================================================================
// FONCTIONS DE DÉBLOCAGE PROGRESSIF
// =============================================================================

/**
 * Calcule la date de déblocage d'une saison
 * @param season - La saison à vérifier
 * @returns La date à laquelle la saison sera débloquée
 */
export const getSeasonUnlockDate = (season: JsSeason): Date => {
  const unlockDate = new Date(JSBOG_LAUNCH_DATE);
  unlockDate.setMonth(unlockDate.getMonth() + season.unlockAfterMonths);
  return unlockDate;
};

/**
 * Vérifie si une saison est débloquée (basé sur la date actuelle)
 * @param season - La saison à vérifier
 * @returns true si la saison est accessible
 */
export const isSeasonUnlocked = (season: JsSeason): boolean => {
  const now = new Date();
  const unlockDate = getSeasonUnlockDate(season);
  return now >= unlockDate;
};

/**
 * Retourne le temps restant avant le déblocage d'une saison
 * @param season - La saison à vérifier
 * @returns Objet avec jours, heures, minutes restants ou null si déjà débloqué
 */
export const getTimeUntilUnlock = (season: JsSeason): { days: number; hours: number; minutes: number } | null => {
  const now = new Date();
  const unlockDate = getSeasonUnlockDate(season);

  if (now >= unlockDate) {
    return null; // Déjà débloqué
  }

  const diff = unlockDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

/**
 * Retourne les saisons débloquées
 */
export const getUnlockedSeasons = (): JsSeason[] => {
  return JS_SEASONS.filter(isSeasonUnlocked);
};

/**
 * Retourne les saisons verrouillées
 */
export const getLockedSeasons = (): JsSeason[] => {
  return JS_SEASONS.filter(s => !isSeasonUnlocked(s));
};

// Color utilities for Tailwind classes
export const SEASON_COLOR_CLASSES = {
  'chrono': {
    bg: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/50',
    hover: 'hover:border-cyan-300'
  },
  'abyss': {
    bg: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-800',
    border: 'border-teal-400',
    text: 'text-teal-400',
    glow: 'shadow-teal-500/50',
    hover: 'hover:border-teal-300'
  },
  'forge': {
    bg: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600',
    border: 'border-orange-400',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/50',
    hover: 'hover:border-orange-300'
  },
  'realm': {
    bg: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
    border: 'border-violet-400',
    text: 'text-violet-400',
    glow: 'shadow-violet-500/50',
    hover: 'hover:border-violet-300'
  }
} as const;
