# ALGOBOG - Plan d'Architecture

> **Niveau Urbain** : Plateforme algorithmique avec 2500 problèmes organisés en 6 phases et 34 modules

---

## Vue d'Ensemble

### Métaphore Urbaine

```
🏙️ ALGOBOG CITY
├── 🏛️ Downtown (Phase 1: Fondamentaux)
│   ├── 🏢 Array Tower (Module 1)
│   ├── 🏢 String Plaza (Module 2)
│   ├── 🏢 Hash Hub (Module 3)
│   └── ... (8 modules, 400 problèmes)
│
├── 🏭 Industrial Zone (Phase 2: Structures)
│   ├── 🏗️ LinkedList Factory (Module 9)
│   └── ... (6 modules, 400 problèmes)
│
├── 🚇 Transit Hub (Phase 3: Graphes)
│   └── ... (5 modules, 300 problèmes)
│
├── 🏢 Tech Park (Phase 4: Algo Avancés)
│   └── ... (5 modules, 400 problèmes)
│
├── 🔬 Research Campus (Phase 5: Spécialisation)
│   └── ... (5 modules, 400 problèmes)
│
└── 🗼 Skyline Tower (Phase 6: Expert)
    └── ... (4 modules, 600 problèmes)
```

---

## 1. Structure de Navigation

### Hiérarchie

```
/algobog                           → City Map (6 districts)
/algobog/district/[slug]           → District View (modules du district)
/algobog/district/[slug]/[module]  → Module View (liste des problèmes)
/algobog/problem/[slug]            → Problem Editor (Monaco + tests)
```

### Flux Utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALGOBOG CITY MAP                         │
│                                                                 │
│   🏛️ Downtown        🏭 Industrial      🚇 Transit Hub         │
│   ┌─────────┐        ┌─────────┐        ┌─────────┐            │
│   │ Phase 1 │───────▶│ Phase 2 │───────▶│ Phase 3 │            │
│   │ 8 mod.  │        │ 6 mod.  │        │ 5 mod.  │            │
│   │ 400 pb  │        │ 400 pb  │        │ 300 pb  │            │
│   └─────────┘        └─────────┘        └─────────┘            │
│        │                  │                  │                  │
│        ▼                  ▼                  ▼                  │
│   🏢 Tech Park      🔬 Research       🗼 Skyline               │
│   ┌─────────┐        ┌─────────┐        ┌─────────┐            │
│   │ Phase 4 │───────▶│ Phase 5 │───────▶│ Phase 6 │            │
│   │ 5 mod.  │        │ 5 mod.  │        │ 4 mod.  │            │
│   │ 400 pb  │        │ 400 pb  │        │ 600 pb  │            │
│   └─────────┘        └─────────┘        └─────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click on district
┌─────────────────────────────────────────────────────────────────┐
│                    DISTRICT: DOWNTOWN                           │
│                    Phase 1 - Fondamentaux                       │
│                                                                 │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│   │ 🏢 Array  │  │ 🏢 String │  │ 🏢 Hash   │  │ 🏢 Two    │  │
│   │   Tower   │  │   Plaza   │  │    Hub    │  │  Pointers │  │
│   │  50 prob  │  │  50 prob  │  │  50 prob  │  │  50 prob  │  │
│   │  ████░░░  │  │  ██░░░░░  │  │  🔒 locked│  │  🔒 locked│  │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                                 │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│   │ 🏢 Binary │  │ 🏢 Sliding│  │ 🏢 Sorting│  │ 🏢 Stack  │  │
│   │  Search   │  │  Window   │  │ Selection │  │  Mastery  │  │
│   │  50 prob  │  │  50 prob  │  │  50 prob  │  │  50 prob  │  │
│   │  🔒 locked│  │  🔒 locked│  │  🔒 locked│  │  🔒 locked│  │
│   └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Click on building
┌─────────────────────────────────────────────────────────────────┐
│                    BUILDING: ARRAY TOWER                        │
│                    Module 1 - Array Basics                      │
│                                                                 │
│   Floor 1 (Easy)           Floor 2 (Medium)      Floor 3 (Hard)│
│   ┌─────────────────┐      ┌─────────────────┐  ┌─────────────┐│
│   │ 1. Binary Search│      │ 41. Rotate Array│  │ 46. Max Gap ││
│   │ 2. Insert Pos   │      │ 42. Best Time II│  │ 47. ...     ││
│   │ 3. Remove Dups  │      │ ...             │  │ ...         ││
│   │ ...             │      │                 │  │             ││
│   │ 40 problems     │      │ 10 problems     │  │ 5 problems  ││
│   └─────────────────┘      └─────────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Collections Appwrite

### 2.1 Collection: `algo-districts`

Districts = Phases (6 entrées)

```typescript
interface AlgoDistrict {
  $id: string;
  slug: string;              // "downtown", "industrial", "transit", etc.
  name: string;              // "Downtown"
  subtitle: string;          // "Phase 1 - Fondamentaux"
  description: string;       // Description détaillée
  icon: string;              // "🏛️"
  color: string;             // "green", "orange", "cyan", etc.
  bgGradient: string;        // "from-green-500 to-emerald-700"
  bgImage?: string;          // URL image de fond optionnelle
  order: number;             // 1-6
  totalModules: number;      // Nombre de modules dans ce district
  totalProblems: number;     // Nombre total de problèmes
  unlockRequirement?: string; // JSON: {districtSlug, minPercent}
  posX: number;              // Position X sur la map (0-100)
  posY: number;              // Position Y sur la map (0-100)
}
```

**Données initiales :**

| slug | name | subtitle | icon | color | order | modules | problems |
|------|------|----------|------|-------|-------|---------|----------|
| downtown | Downtown | Phase 1 - Fondamentaux | 🏛️ | green | 1 | 8 | 400 |
| industrial | Industrial Zone | Phase 2 - Structures | 🏭 | orange | 2 | 6 | 400 |
| transit | Transit Hub | Phase 3 - Graphes | 🚇 | cyan | 3 | 5 | 300 |
| tech-park | Tech Park | Phase 4 - Algo Avancés | 🏢 | purple | 4 | 5 | 400 |
| research | Research Campus | Phase 5 - Spécialisation | 🔬 | pink | 5 | 5 | 400 |
| skyline | Skyline Tower | Phase 6 - Expert | 🗼 | amber | 6 | 4 | 600 |

### 2.2 Collection: `algo-buildings`

Buildings = Modules (34 entrées)

```typescript
interface AlgoBuilding {
  $id: string;
  slug: string;              // "array-tower", "string-plaza", etc.
  districtSlug: string;      // Référence au district parent
  name: string;              // "Array Tower"
  subtitle: string;          // "Module 1 - Array Basics"
  description: string;       // Description du module
  icon: string;              // "🏢"
  color: string;             // Couleur spécifique ou héritée
  order: number;             // Ordre dans le district (1-8)
  concepts: string;          // JSON array: ["parcours", "manipulation", "in-place"]
  totalProblems: number;     // Nombre de problèmes
  easyCount: number;         // Nombre de problèmes Easy
  mediumCount: number;       // Nombre de problèmes Medium
  hardCount: number;         // Nombre de problèmes Hard
  problemRange: string;      // "1-50" (pour référence)
  unlockRequirement?: string; // JSON: {buildingSlug, minPercent}
}
```

**Données Phase 1 (Downtown) :**

| order | slug | name | concepts | problems | easy | med | hard |
|-------|------|------|----------|----------|------|-----|------|
| 1 | array-tower | Array Tower | parcours, manipulation, in-place | 50 | 40 | 10 | 0 |
| 2 | string-plaza | String Plaza | manipulation, parsing, palindrome | 50 | 35 | 15 | 0 |
| 3 | hash-hub | Hash Hub | lookup O(1), counting, grouping | 50 | 30 | 20 | 0 |
| 4 | two-pointers-bridge | Two Pointers Bridge | opposés, même direction, fast/slow | 50 | 25 | 25 | 0 |
| 5 | binary-search-center | Binary Search Center | rotated, peak, boundary | 50 | 15 | 30 | 5 |
| 6 | sliding-window-mall | Sliding Window Mall | fixed size, variable size, optimal | 50 | 15 | 30 | 5 |
| 7 | sorting-station | Sorting Station | quick select, merge sort, bucket | 50 | 15 | 30 | 5 |
| 8 | stack-skyscraper | Stack Skyscraper | monotonic, parsing, backtracking | 50 | 20 | 25 | 5 |

### 2.3 Collection: `algo-problems`

Problems = Problèmes individuels (2500 entrées)

```typescript
interface AlgoProblem {
  $id: string;
  slug: string;                // "binary-search", "two-sum", etc.
  buildingSlug: string;        // Référence au building parent
  districtSlug: string;        // Référence au district (dénormalisé)

  // Identification
  problemNumber: number;       // 1-2500 (numéro global)
  localNumber: number;         // 1-50 (numéro dans le module)
  leetcodeNumber?: number;     // Numéro LeetCode original (si applicable)
  leetcodeTitle?: string;      // Titre LeetCode original

  // Contenu
  title: string;               // Titre reformulé (contexte réel)
  statement: string;           // Énoncé complet (markdown)
  context: string;             // Contexte métier (e-commerce, RH, etc.)

  // Difficulté
  difficulty: 'easy' | 'medium' | 'hard';
  floor: number;               // 1=easy, 2=medium, 3=hard (pour affichage)

  // Code
  starterCode: string;         // Template de départ
  testCode: string;            // Tests unitaires
  solution?: string;           // Solution de référence (optionnel)

  // Métadonnées
  order: number;               // Ordre d'affichage
  xpReward: number;            // XP gagné (10 easy, 25 med, 50 hard)
  timeLimit?: number;          // Limite de temps en secondes
  tags?: string;               // JSON array de tags
  hints?: string;              // JSON array d'indices
  approaches?: string;         // JSON: différentes approches avec complexité
}
```

### 2.4 Collection: `algo-submissions`

Soumissions utilisateur

```typescript
interface AlgoSubmission {
  $id: string;
  userId: string;              // ID utilisateur Appwrite
  problemSlug: string;         // Référence au problème
  buildingSlug: string;        // Dénormalisé pour queries rapides
  districtSlug: string;        // Dénormalisé pour queries rapides

  // Résultat
  passed: boolean;             // Réussi ou non
  code: string;                // Code soumis
  executionTime?: number;      // Temps d'exécution (ms)
  memoryUsage?: number;        // Mémoire utilisée (KB)

  // Timestamps
  submittedAt: string;         // ISO timestamp
  firstPassedAt?: string;      // Premier succès (pour stats)

  // Gamification
  xpEarned: number;            // XP gagné pour cette soumission
  stars?: number;              // 1-3 étoiles basées sur performance
}
```

### 2.5 Collection: `algo-progress`

Progression agrégée (cache pour performance)

```typescript
interface AlgoProgress {
  $id: string;
  userId: string;

  // Par building
  buildingSlug: string;
  completedProblems: number;
  totalProblems: number;
  percentComplete: number;

  // Par difficulté
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;

  // XP
  totalXp: number;

  // Timestamps
  lastActivityAt: string;
  firstCompletedAt?: string;
  allCompletedAt?: string;
}
```

---

## 3. Structure des Fichiers

### 3.1 Routes Next.js

```
src/app/algobog/
├── page.tsx                           # City Map (6 districts)
├── layout.tsx                         # Layout commun ALGOBOG
├── loading.tsx                        # Loading state
│
├── district/
│   └── [slug]/
│       ├── page.tsx                   # District View (buildings)
│       ├── loading.tsx
│       │
│       └── [building]/
│           ├── page.tsx               # Building View (problems list)
│           └── loading.tsx
│
└── problem/
    └── [slug]/
        ├── page.tsx                   # Problem Editor
        └── loading.tsx
```

### 3.2 Composants

```
src/components/algobog/
├── CityMap.tsx                        # Vue ville avec 6 districts
├── CityMapConnections.tsx             # Lignes de métro entre districts
├── DistrictCard.tsx                   # Card d'un district
├── DistrictModal.tsx                  # Modal détails district
│
├── BuildingGrid.tsx                   # Grille des buildings d'un district
├── BuildingCard.tsx                   # Card d'un building
├── FloorTabs.tsx                      # Onglets Easy/Medium/Hard
│
├── ProblemList.tsx                    # Liste des problèmes
├── ProblemCard.tsx                    # Card d'un problème
├── ProblemEditor.tsx                  # Éditeur Monaco + tests
│
├── ProgressBar.tsx                    # Barre de progression
├── XpBadge.tsx                        # Badge XP
├── UnlockIndicator.tsx                # Indicateur déverrouillé/verrouillé
│
└── UrbanBackground.tsx                # Background animé ville
```

### 3.3 Utilitaires

```
src/lib/algobog/
├── district-utils.ts                  # Logique districts
├── building-utils.ts                  # Logique buildings
├── problem-utils.ts                   # Logique problèmes
├── progress-utils.ts                  # Calcul progression
├── unlock-utils.ts                    # Logique déverrouillage
└── xp-utils.ts                        # Calcul XP
```

### 3.4 Scripts de Setup

```
scripts/
├── setup-algo-districts.ts            # Créer collection districts
├── setup-algo-buildings.ts            # Créer collection buildings
├── setup-algo-problems.ts             # Créer collection problems
├── import-problems-batch.ts           # Import batch depuis CURRICULUM
└── seed-algo-data.ts                  # Script principal de seeding
```

---

## 4. Design Visuel

### 4.1 Palette Urbaine

```typescript
const DISTRICT_COLORS = {
  downtown: {
    primary: '#22c55e',      // green-500
    secondary: '#16a34a',    // green-600
    gradient: 'from-green-500 to-emerald-700',
    glow: 'shadow-green-500/50',
    accent: '#4ade80',       // green-400
  },
  industrial: {
    primary: '#f97316',      // orange-500
    secondary: '#ea580c',    // orange-600
    gradient: 'from-orange-500 to-amber-700',
    glow: 'shadow-orange-500/50',
    accent: '#fb923c',       // orange-400
  },
  transit: {
    primary: '#06b6d4',      // cyan-500
    secondary: '#0891b2',    // cyan-600
    gradient: 'from-cyan-500 to-teal-700',
    glow: 'shadow-cyan-500/50',
    accent: '#22d3ee',       // cyan-400
  },
  'tech-park': {
    primary: '#a855f7',      // purple-500
    secondary: '#9333ea',    // purple-600
    gradient: 'from-purple-500 to-violet-700',
    glow: 'shadow-purple-500/50',
    accent: '#c084fc',       // purple-400
  },
  research: {
    primary: '#ec4899',      // pink-500
    secondary: '#db2777',    // pink-600
    gradient: 'from-pink-500 to-rose-700',
    glow: 'shadow-pink-500/50',
    accent: '#f472b6',       // pink-400
  },
  skyline: {
    primary: '#f59e0b',      // amber-500
    secondary: '#d97706',    // amber-600
    gradient: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-500/50',
    accent: '#fbbf24',       // amber-400
  },
};
```

### 4.2 Icônes Buildings par Module

```typescript
const BUILDING_ICONS = {
  // Phase 1 - Downtown
  'array-tower': '🏢',
  'string-plaza': '🏬',
  'hash-hub': '🏦',
  'two-pointers-bridge': '🌉',
  'binary-search-center': '🎯',
  'sliding-window-mall': '🛒',
  'sorting-station': '🚉',
  'stack-skyscraper': '🏙️',

  // Phase 2 - Industrial
  'linked-list-factory': '🏭',
  'queue-warehouse': '📦',
  'tree-greenhouse': '🌳',
  'bst-laboratory': '🔬',
  'heap-refinery': '⛽',
  'trie-telecom': '📡',

  // Phase 3 - Transit
  'bfs-metro': '🚇',
  'dfs-tunnel': '🚇',
  'topo-terminal': '🚏',
  'union-junction': '🔗',
  'shortest-path-highway': '🛣️',

  // Phase 4 - Tech Park
  'backtrack-incubator': '💡',
  'dp-datacenter': '🖥️',
  'segment-server': '🗄️',
  'fenwick-firewall': '🔥',
  'dp2d-mainframe': '🖲️',

  // Phase 5 - Research
  'greedy-lab': '🧪',
  'bitwise-bunker': '💾',
  'math-observatory': '🔭',
  'design-studio': '🎨',
  'concurrency-reactor': '⚛️',

  // Phase 6 - Skyline
  'advanced-dp-penthouse': '🏰',
  'hard-graph-helipad': '🚁',
  'string-algo-antenna': '📻',
  'contest-crown': '👑',
};
```

### 4.3 Éléments Visuels

**City Map :**
- Background : Gradient sombre avec grille de ville
- Districts : Hexagones ou rectangles avec glow effect
- Connexions : Lignes de métro animées (dash-array animation)
- Particules : Lumières de ville en arrière-plan

**District View :**
- Header : Bannière avec nom et stats du district
- Buildings : Cards avec icône, nom, barre de progression
- Layout : Grid responsive (2-3-4 colonnes)

**Building View :**
- Tabs : Easy / Medium / Hard (avec compteurs)
- Problems : Liste scrollable avec numéro, titre, status
- Filters : Par status (tous, résolus, non résolus)

---

## 5. Système de Progression

### 5.1 Règles de Déverrouillage

```typescript
const UNLOCK_RULES = {
  // Districts
  districts: {
    downtown: null,                           // Toujours déverrouillé
    industrial: { district: 'downtown', percent: 50 },
    transit: { district: 'industrial', percent: 50 },
    'tech-park': { district: 'transit', percent: 50 },
    research: { district: 'tech-park', percent: 50 },
    skyline: { district: 'research', percent: 75 },
  },

  // Buildings (premier de chaque district toujours déverrouillé)
  buildings: {
    // Downtown
    'array-tower': null,
    'string-plaza': { building: 'array-tower', percent: 30 },
    'hash-hub': { building: 'string-plaza', percent: 30 },
    // ... progression linéaire dans chaque district
  },
};
```

### 5.2 Système XP

```typescript
const XP_REWARDS = {
  easy: 10,
  medium: 25,
  hard: 50,

  // Bonus
  firstTry: 1.5,           // Multiplicateur premier essai réussi
  speedBonus: 1.2,         // < 5 min pour easy, < 15 min pour medium
  streakBonus: 0.1,        // +10% par problème consécutif (max 50%)
};

const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  // ... progression exponentielle
];
```

### 5.3 Badges / Achievements

```typescript
const ACHIEVEMENTS = {
  // Progression
  'first-solve': { name: 'Premier Pas', desc: 'Résoudre votre premier problème' },
  'building-complete': { name: 'Architecte', desc: 'Compléter un building' },
  'district-complete': { name: 'Maire', desc: 'Compléter un district' },
  'city-complete': { name: 'Gouverneur', desc: 'Compléter toute la ville' },

  // Difficulté
  'hard-solver': { name: 'Expert', desc: 'Résoudre 10 problèmes Hard' },
  'no-hints': { name: 'Autonome', desc: 'Résoudre 50 problèmes sans indice' },

  // Streak
  'streak-7': { name: 'Semaine Active', desc: '7 jours consécutifs' },
  'streak-30': { name: 'Mois Intense', desc: '30 jours consécutifs' },

  // Speed
  'speed-demon': { name: 'Éclair', desc: 'Résoudre 5 Easy en moins de 2 min chacun' },
};
```

---

## 6. Plan d'Implémentation

### Phase 1 : Infrastructure (Semaine 1)

1. **Jour 1-2 : Setup Appwrite**
   - [ ] Créer les 4 collections
   - [ ] Définir les attributs et index
   - [ ] Configurer les permissions

2. **Jour 3-4 : Scripts de Seeding**
   - [ ] Script setup-algo-districts.ts
   - [ ] Script setup-algo-buildings.ts
   - [ ] Parser PROBLEMS_CURRICULUM.md

3. **Jour 5 : Routes de Base**
   - [ ] Layout ALGOBOG
   - [ ] Route /algobog (placeholder)
   - [ ] Route /algobog/district/[slug] (placeholder)

### Phase 2 : City Map (Semaine 2)

1. **Jour 1-2 : Composant CityMap**
   - [ ] Layout des 6 districts
   - [ ] Connexions animées
   - [ ] Background urbain

2. **Jour 3-4 : Interactivité**
   - [ ] Hover states
   - [ ] Modal de sélection
   - [ ] Indicateurs de progression

3. **Jour 5 : Responsive**
   - [ ] Mobile layout
   - [ ] Touch interactions

### Phase 3 : District & Building Views (Semaine 3)

1. **Jour 1-2 : District View**
   - [ ] Header avec stats
   - [ ] Grid de buildings
   - [ ] Filtres et tri

2. **Jour 3-4 : Building View**
   - [ ] Tabs par difficulté
   - [ ] Liste de problèmes
   - [ ] Progression par floor

3. **Jour 5 : Navigation**
   - [ ] Breadcrumbs
   - [ ] Retour et navigation fluide

### Phase 4 : Problem Editor (Semaine 4)

1. **Jour 1-2 : Monaco Integration**
   - [ ] Éditeur de code
   - [ ] Syntax highlighting
   - [ ] Auto-completion

2. **Jour 3-4 : Exécution**
   - [ ] Sandbox isolated-vm
   - [ ] Tests unitaires
   - [ ] Feedback visuel

3. **Jour 5 : Soumission**
   - [ ] Sauvegarde progression
   - [ ] Animation de succès
   - [ ] Navigation au suivant

### Phase 5 : Progression & Polish (Semaine 5)

1. **Jour 1-2 : Système XP**
   - [ ] Calcul et affichage
   - [ ] Niveaux utilisateur
   - [ ] Leaderboard basique

2. **Jour 3-4 : Unlock System**
   - [ ] Logique de déverrouillage
   - [ ] Animations unlock
   - [ ] Notifications

3. **Jour 5 : Polish**
   - [ ] Animations et transitions
   - [ ] Loading states
   - [ ] Error handling

---

## 7. Dépendances

### Packages Existants (réutilisés)
- `@monaco-editor/react` - Éditeur de code
- `isolated-vm` - Sandbox d'exécution
- `framer-motion` - Animations (si installé)

### Packages à Ajouter
- Aucun nouveau package requis

---

## 8. Intégration Navbar

Mise à jour de `/src/components/Navbar.tsx` :

```typescript
const navLinks = [
  { href: '/jsbog', label: 'JSBOG' },
  { href: '/cbog', label: 'CBOG' },
  { href: '/algobog', label: 'ALGOBOG' },  // ← Ajouter
];
```

Mise à jour de `/src/app/page.tsx` :

```typescript
// Remplacer le bouton disabled par un lien actif
<Link href="/algobog">
  <button className="...">
    ALGOBOG
  </button>
</Link>
```

---

## 9. Métriques de Succès

| Métrique | Objectif |
|----------|----------|
| Temps de chargement City Map | < 2s |
| Temps de chargement Problem | < 1s |
| Couverture de tests | > 80% |
| Problèmes importés Phase 1 | 400 |
| Utilisateurs actifs (J+30) | 100+ |

---

*Document créé le 2026-01-31*
*Version 1.0*
