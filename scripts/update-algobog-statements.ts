/**
 * Script to update ALGOBOG problem statements
 * - Generate French instructions based on problem title and module
 * - Remove all LeetCode references
 * - Create structured problem descriptions
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Module descriptions in French
const MODULE_CONTEXTS: Record<string, { context: string; verb: string }> = {
  'array-tower': {
    context: 'manipulation de tableaux',
    verb: 'manipuler et transformer des tableaux',
  },
  'string-plaza': {
    context: 'manipulation de chaînes de caractères',
    verb: 'analyser et transformer des chaînes',
  },
  'hash-hub': {
    context: 'tables de hachage et dictionnaires',
    verb: 'utiliser des structures de données associatives',
  },
  'two-pointers-bridge': {
    context: 'technique des deux pointeurs',
    verb: 'parcourir efficacement avec deux indices',
  },
  'binary-search-center': {
    context: 'recherche dichotomique',
    verb: 'rechercher efficacement dans des données triées',
  },
  'sliding-window-mall': {
    context: 'technique de la fenêtre glissante',
    verb: 'analyser des sous-ensembles contigus',
  },
  'sorting-station': {
    context: 'algorithmes de tri',
    verb: 'trier et organiser des données',
  },
  'stack-skyscraper': {
    context: 'structures de pile (LIFO)',
    verb: 'utiliser une pile pour résoudre des problèmes',
  },
  'linked-list-factory': {
    context: 'listes chaînées',
    verb: 'manipuler des structures de données chaînées',
  },
  'queue-warehouse': {
    context: 'files d\'attente (FIFO)',
    verb: 'gérer des files d\'attente',
  },
  'tree-greenhouse': {
    context: 'structures arborescentes',
    verb: 'parcourir et manipuler des arbres',
  },
  'bst-laboratory': {
    context: 'arbres binaires de recherche',
    verb: 'exploiter les propriétés des BST',
  },
  'heap-refinery': {
    context: 'tas et files de priorité',
    verb: 'gérer des priorités efficacement',
  },
  'trie-telecom': {
    context: 'arbres préfixes (tries)',
    verb: 'rechercher des préfixes efficacement',
  },
  'bfs-metro': {
    context: 'parcours en largeur (BFS)',
    verb: 'explorer niveau par niveau',
  },
  'dfs-tunnel': {
    context: 'parcours en profondeur (DFS)',
    verb: 'explorer en profondeur d\'abord',
  },
  'topo-terminal': {
    context: 'tri topologique',
    verb: 'ordonner des dépendances',
  },
  'union-junction': {
    context: 'structures Union-Find',
    verb: 'gérer des ensembles disjoints',
  },
  'shortest-path-highway': {
    context: 'plus courts chemins',
    verb: 'trouver des chemins optimaux',
  },
  'backtrack-incubator': {
    context: 'backtracking',
    verb: 'explorer toutes les possibilités',
  },
  'dp-datacenter': {
    context: 'programmation dynamique',
    verb: 'optimiser avec mémoïsation',
  },
  'segment-server': {
    context: 'arbres de segments',
    verb: 'effectuer des requêtes d\'intervalle',
  },
  'fenwick-firewall': {
    context: 'arbres de Fenwick (BIT)',
    verb: 'calculer des sommes préfixes',
  },
  'greedy-lab': {
    context: 'algorithmes gloutons',
    verb: 'faire des choix localement optimaux',
  },
  'bitwise-bunker': {
    context: 'manipulation de bits',
    verb: 'manipuler des données au niveau binaire',
  },
  'math-observatory': {
    context: 'mathématiques algorithmiques',
    verb: 'appliquer des concepts mathématiques',
  },
  'design-studio': {
    context: 'conception de systèmes',
    verb: 'concevoir des structures de données',
  },
  'concurrency-reactor': {
    context: 'programmation concurrente',
    verb: 'gérer des opérations parallèles',
  },
  'advanced-dp-penthouse': {
    context: 'programmation dynamique avancée',
    verb: 'résoudre des problèmes DP complexes',
  },
  'hard-graph-helipad': {
    context: 'graphes avancés',
    verb: 'résoudre des problèmes de graphes complexes',
  },
  'string-algo-antenna': {
    context: 'algorithmes de chaînes avancés',
    verb: 'appliquer des algorithmes de chaînes',
  },
  'contest-crown': {
    context: 'problèmes de compétition',
    verb: 'résoudre des défis de niveau compétition',
  },
};

// Difficulty translations
const DIFFICULTY_FR: Record<string, string> = {
  easy: 'facile',
  medium: 'intermédiaire',
  hard: 'difficile',
};

// Title translations (common patterns)
function translateTitle(title: string): string {
  const translations: Record<string, string> = {
    'Remove Duplicates': 'Supprimer les Doublons',
    'Remove Element': 'Supprimer un Élément',
    'Search Insert Position': 'Position d\'Insertion',
    'Merge Sorted Array': 'Fusionner des Tableaux Triés',
    'Move Zeroes': 'Déplacer les Zéros',
    'Plus One': 'Ajouter Un',
    'Two Sum': 'Somme de Deux',
    'Three Sum': 'Somme de Trois',
    'Valid Parentheses': 'Parenthèses Valides',
    'Reverse String': 'Inverser une Chaîne',
    'Valid Palindrome': 'Palindrome Valide',
    'Binary Search': 'Recherche Binaire',
    'Contains Duplicate': 'Contient des Doublons',
    'Maximum': 'Maximum',
    'Minimum': 'Minimum',
    'Find': 'Trouver',
    'Count': 'Compter',
    'Sort': 'Trier',
    'Merge': 'Fusionner',
    'Split': 'Diviser',
    'Rotate': 'Rotation',
    'Reverse': 'Inverser',
    'Sum': 'Somme',
    'Product': 'Produit',
    'Average': 'Moyenne',
    'Longest': 'Plus Long',
    'Shortest': 'Plus Court',
    'First': 'Premier',
    'Last': 'Dernier',
    'Unique': 'Unique',
    'Common': 'Commun',
    'Missing': 'Manquant',
    'Duplicate': 'Doublon',
    'Subarray': 'Sous-tableau',
    'Substring': 'Sous-chaîne',
    'Subsequence': 'Sous-séquence',
    'Path': 'Chemin',
    'Tree': 'Arbre',
    'Node': 'Nœud',
    'List': 'Liste',
    'Array': 'Tableau',
    'String': 'Chaîne',
    'Number': 'Nombre',
    'Integer': 'Entier',
    'Matrix': 'Matrice',
    'Grid': 'Grille',
    'Graph': 'Graphe',
    'Stack': 'Pile',
    'Queue': 'File',
    'Heap': 'Tas',
    'Valid': 'Valide',
    'Invalid': 'Invalide',
    'Check': 'Vérifier',
    'Detect': 'Détecter',
    'Calculate': 'Calculer',
    'Convert': 'Convertir',
    'Transform': 'Transformer',
    'Partition': 'Partitionner',
    'Flatten': 'Aplatir',
    'Depth': 'Profondeur',
    'Level': 'Niveau',
    'Order': 'Ordre',
    'Balanced': 'Équilibré',
    'Symmetric': 'Symétrique',
    'Invert': 'Inverser',
    'Clone': 'Cloner',
    'Copy': 'Copier',
    'Delete': 'Supprimer',
    'Insert': 'Insérer',
    'Update': 'Mettre à jour',
    'Search': 'Rechercher',
  };

  let result = title;
  for (const [en, fr] of Object.entries(translations)) {
    result = result.replace(new RegExp(en, 'gi'), fr);
  }
  return result;
}

function generateStatement(
  title: string,
  buildingSlug: string,
  difficulty: string,
  order: number
): string {
  const moduleInfo = MODULE_CONTEXTS[buildingSlug] || {
    context: 'algorithmique',
    verb: 'résoudre un problème',
  };

  const frTitle = translateTitle(title);
  const difficultyFr = DIFFICULTY_FR[difficulty] || difficulty;

  return `## ${frTitle}

### Objectif
Ce problème de niveau **${difficultyFr}** porte sur la **${moduleInfo.context}**.

Votre mission est de ${moduleInfo.verb} pour résoudre ce défi algorithmique.

### Description
Implémentez une solution efficace pour le problème "${frTitle}".

Analysez attentivement les contraintes et exemples fournis pour comprendre les cas limites.

### Conseils
- Commencez par analyser les exemples donnés
- Identifiez les patterns et les cas particuliers
- Pensez à la complexité temporelle et spatiale de votre solution
- Testez avec des cas limites (tableau vide, un seul élément, etc.)

### Contraintes
- Respectez les limites de temps et de mémoire
- Votre solution doit gérer tous les cas de test

Bonne chance ! 🚀`;
}

async function updateStatements() {
  console.log('🚀 ALGOBOG Statement Updater');
  console.log('============================\n');

  let offset = 0;
  const limit = 100;
  let totalUpdated = 0;
  let totalProcessed = 0;

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'algo-problems',
      [Query.limit(limit), Query.offset(offset), Query.orderAsc('order')]
    );

    if (response.documents.length === 0) break;

    for (const doc of response.documents) {
      const title = doc.leetcodeTitle as string;
      const buildingSlug = doc.buildingSlug as string;
      const difficulty = doc.difficulty as string;
      const order = doc.order as number;

      // Generate new French statement
      const newStatement = generateStatement(title, buildingSlug, difficulty, order);

      // Update document
      await databases.updateDocument(
        DATABASE_ID,
        'algo-problems',
        doc.$id,
        {
          statement: newStatement,
          // Remove leetcode references from title
          title: translateTitle(title),
        }
      );

      totalUpdated++;
      totalProcessed++;

      if (totalProcessed % 100 === 0) {
        console.log(`   Processed: ${totalProcessed} problems`);
      }
    }

    offset += limit;

    if (response.documents.length < limit) break;
  }

  console.log(`\n✅ Updated ${totalUpdated} problem statements`);
}

// Also update the API to not return leetcodeNumber
console.log('Note: Also update API to hide leetcodeNumber from responses');

updateStatements().catch(console.error);
