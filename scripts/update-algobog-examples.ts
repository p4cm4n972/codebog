/**
 * Script to add examples and constraints to ALGOBOG problems
 * Generates contextual examples based on problem type and module
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

// Examples templates by module type
const MODULE_EXAMPLES: Record<string, {
  inputType: string;
  outputType: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
}> = {
  'array-tower': {
    inputType: 'tableau d\'entiers',
    outputType: 'tableau ou entier',
    examples: [
      { input: 'nums = [1, 2, 3, 4, 5]', output: '[résultat attendu]', explanation: 'Exemple basique avec un tableau ordonné' },
      { input: 'nums = [5, 3, 1, 4, 2]', output: '[résultat attendu]', explanation: 'Tableau non ordonné' },
      { input: 'nums = []', output: '[résultat pour cas vide]', explanation: 'Cas limite : tableau vide' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'La solution doit être en O(n) ou O(n log n)',
    ],
  },
  'string-plaza': {
    inputType: 'chaîne de caractères',
    outputType: 'chaîne ou booléen',
    examples: [
      { input: 's = "hello"', output: '[résultat attendu]', explanation: 'Chaîne simple en minuscules' },
      { input: 's = "Hello World"', output: '[résultat attendu]', explanation: 'Chaîne avec majuscules et espace' },
      { input: 's = ""', output: '[résultat pour cas vide]', explanation: 'Cas limite : chaîne vide' },
    ],
    constraints: [
      '0 ≤ s.length ≤ 10⁵',
      's contient uniquement des caractères ASCII imprimables',
      'La solution doit être en O(n)',
    ],
  },
  'hash-hub': {
    inputType: 'tableau ou chaîne',
    outputType: 'entier, booléen ou tableau',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true', explanation: 'Le nombre 1 apparaît deux fois' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false', explanation: 'Tous les éléments sont uniques' },
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Les deux chaînes contiennent les mêmes caractères' },
    ],
    constraints: [
      '1 ≤ longueur ≤ 10⁵',
      'Utiliser une table de hachage pour optimiser',
      'Complexité attendue : O(n)',
    ],
  },
  'two-pointers-bridge': {
    inputType: 'tableau trié ou chaîne',
    outputType: 'indices ou booléen',
    examples: [
      { input: 'nums = [1, 2, 3, 4, 6], target = 5', output: '[1, 2]', explanation: 'nums[1] + nums[2] = 2 + 3 = 5' },
      { input: 's = "racecar"', output: 'true', explanation: 'La chaîne est un palindrome' },
      { input: 'nums = [1, 1, 1, 1]', output: '[résultat]', explanation: 'Cas avec éléments identiques' },
    ],
    constraints: [
      '2 ≤ longueur ≤ 10⁴',
      'Le tableau est généralement trié',
      'Utiliser deux pointeurs (début/fin ou lent/rapide)',
    ],
  },
  'binary-search-center': {
    inputType: 'tableau trié',
    outputType: 'indice ou valeur',
    examples: [
      { input: 'nums = [1, 3, 5, 7, 9], target = 5', output: '2', explanation: 'L\'élément 5 est à l\'indice 2' },
      { input: 'nums = [1, 3, 5, 7, 9], target = 4', output: '-1', explanation: 'L\'élément 4 n\'existe pas' },
      { input: 'nums = [1], target = 1', output: '0', explanation: 'Cas avec un seul élément' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      'Le tableau est trié par ordre croissant',
      'Complexité attendue : O(log n)',
    ],
  },
  'sliding-window-mall': {
    inputType: 'tableau ou chaîne',
    outputType: 'entier (max/min/count)',
    examples: [
      { input: 'nums = [1, 3, -1, -3, 5, 3], k = 3', output: '[3, 3, 5, 5]', explanation: 'Maximum de chaque fenêtre de taille 3' },
      { input: 's = "abcabcbb"', output: '3', explanation: 'Plus longue sous-chaîne sans répétition : "abc"' },
      { input: 'nums = [1, 1, 1], k = 2', output: '[résultat]', explanation: 'Fenêtre avec éléments identiques' },
    ],
    constraints: [
      '1 ≤ longueur ≤ 10⁵',
      '1 ≤ k ≤ longueur',
      'Utiliser une fenêtre glissante pour O(n)',
    ],
  },
  'sorting-station': {
    inputType: 'tableau non trié',
    outputType: 'tableau trié ou indices',
    examples: [
      { input: 'nums = [5, 2, 3, 1]', output: '[1, 2, 3, 5]', explanation: 'Tableau trié par ordre croissant' },
      { input: 'nums = [5, 1, 1, 2, 0, 0]', output: '[0, 0, 1, 1, 2, 5]', explanation: 'Tri avec doublons' },
      { input: 'intervals = [[1,3], [2,6], [8,10]]', output: '[[1,6], [8,10]]', explanation: 'Fusion d\'intervalles' },
    ],
    constraints: [
      '1 ≤ longueur ≤ 5 × 10⁴',
      'Tri en place si possible',
      'Complexité : O(n log n) pour tri standard',
    ],
  },
  'stack-skyscraper': {
    inputType: 'chaîne ou tableau',
    outputType: 'booléen, entier ou tableau',
    examples: [
      { input: 's = "()[]{}"', output: 'true', explanation: 'Toutes les parenthèses sont correctement fermées' },
      { input: 's = "([)]"', output: 'false', explanation: 'Ordre incorrect des parenthèses' },
      { input: 'temperatures = [73, 74, 75, 71, 69]', output: '[1, 1, 4, 2, 0]', explanation: 'Jours avant une température plus chaude' },
    ],
    constraints: [
      '1 ≤ longueur ≤ 10⁴',
      'Utiliser une pile (LIFO)',
      'Complexité attendue : O(n)',
    ],
  },
  'linked-list-factory': {
    inputType: 'liste chaînée',
    outputType: 'liste chaînée ou valeur',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Liste inversée' },
      { input: 'head = [1, 2, 3, 4, 5], n = 2', output: '[1, 2, 3, 5]', explanation: 'Suppression du 2e élément depuis la fin' },
      { input: 'head = []', output: '[]', explanation: 'Cas limite : liste vide' },
    ],
    constraints: [
      '0 ≤ nombre de nœuds ≤ 5000',
      'Les valeurs peuvent être négatives',
      'Attention aux pointeurs null',
    ],
  },
  'tree-greenhouse': {
    inputType: 'arbre binaire',
    outputType: 'tableau, entier ou booléen',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]', explanation: 'Parcours par niveau' },
      { input: 'root = [1, 2, 3]', output: '6', explanation: 'Somme de tous les nœuds' },
      { input: 'root = []', output: '0', explanation: 'Arbre vide' },
    ],
    constraints: [
      '0 ≤ nombre de nœuds ≤ 10⁴',
      '-100 ≤ Node.val ≤ 100',
      'Utiliser récursion ou file pour parcours',
    ],
  },
  'dp-datacenter': {
    inputType: 'tableau ou grille',
    outputType: 'entier (optimal)',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: '4', explanation: 'Maison 1 + maison 3 = 1 + 3 = 4' },
      { input: 'cost = [[10, 15, 20], [15, 10, 5]]', output: '15', explanation: 'Chemin de coût minimum' },
      { input: 'n = 3', output: '3', explanation: 'Nombre de façons différentes' },
    ],
    constraints: [
      '1 ≤ n ≤ 100',
      'Définir les sous-problèmes et la récurrence',
      'Utiliser mémoïsation ou tabulation',
    ],
  },
  'backtrack-incubator': {
    inputType: 'tableau ou contraintes',
    outputType: 'liste de toutes les solutions',
    examples: [
      { input: 'nums = [1, 2, 3]', output: '[[1,2,3], [1,3,2], [2,1,3], ...]', explanation: 'Toutes les permutations' },
      { input: 'candidates = [2, 3, 6, 7], target = 7', output: '[[2,2,3], [7]]', explanation: 'Combinaisons dont la somme = 7' },
      { input: 'n = 4', output: '[[...], [...]]', explanation: 'Solutions du problème des N reines' },
    ],
    constraints: [
      '1 ≤ taille ≤ 20',
      'Explorer toutes les possibilités',
      'Élaguer les branches impossibles',
    ],
  },
};

// Default examples for modules not specifically defined
const DEFAULT_EXAMPLES = {
  inputType: 'données selon le contexte',
  outputType: 'résultat attendu',
  examples: [
    { input: 'Voir les exemples spécifiques', output: 'Résultat attendu', explanation: 'Analysez les cas de test fournis' },
    { input: 'Cas nominal', output: 'Résultat correct', explanation: 'Cas standard du problème' },
    { input: 'Cas limite', output: 'Gestion appropriée', explanation: 'Testez les cas limites (vide, un élément, etc.)' },
  ],
  constraints: [
    'Respectez les contraintes de temps',
    'Gérez les cas limites',
    'Optimisez si nécessaire',
  ],
};

function generateEnhancedStatement(
  currentStatement: string,
  buildingSlug: string,
  title: string
): string {
  const moduleInfo = MODULE_EXAMPLES[buildingSlug] || DEFAULT_EXAMPLES;

  // Extract the existing statement parts (keep objective and description)
  const lines = currentStatement.split('\n');
  let baseStatement = '';
  let inExamples = false;

  for (const line of lines) {
    if (line.includes('### Exemples') || line.includes('### Contraintes')) {
      inExamples = true;
    }
    if (!inExamples) {
      baseStatement += line + '\n';
    }
  }

  // Generate examples section
  let examplesSection = '\n### Exemples\n\n';
  moduleInfo.examples.forEach((ex, i) => {
    examplesSection += `**Exemple ${i + 1}:**\n`;
    examplesSection += `- Entrée : \`${ex.input}\`\n`;
    examplesSection += `- Sortie : \`${ex.output}\`\n`;
    examplesSection += `- Explication : ${ex.explanation}\n\n`;
  });

  // Generate constraints section
  let constraintsSection = '### Contraintes\n\n';
  moduleInfo.constraints.forEach(constraint => {
    constraintsSection += `- ${constraint}\n`;
  });

  return baseStatement.trim() + '\n\n' + examplesSection + constraintsSection;
}

async function updateExamples() {
  console.log('🚀 ALGOBOG Examples & Constraints Updater');
  console.log('==========================================\n');

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
      const currentStatement = doc.statement as string;
      const buildingSlug = doc.buildingSlug as string;
      const title = doc.title as string;

      // Generate enhanced statement with examples
      const enhancedStatement = generateEnhancedStatement(
        currentStatement,
        buildingSlug,
        title
      );

      // Update document
      await databases.updateDocument(
        DATABASE_ID,
        'algo-problems',
        doc.$id,
        {
          statement: enhancedStatement,
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

  console.log(`\n✅ Added examples to ${totalUpdated} problems`);
}

updateExamples().catch(console.error);
