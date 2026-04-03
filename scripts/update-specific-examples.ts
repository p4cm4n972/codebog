/**
 * Script to generate problem-specific examples based on title patterns
 * More accurate examples based on what the problem is actually asking
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

// Problem-specific examples based on title patterns
const PROBLEM_EXAMPLES: Record<string, {
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
}> = {
  // Array problems
  'merge sorted': {
    description: 'Fusionnez deux tableaux triés en un seul tableau trié. Le premier tableau a suffisamment d\'espace pour contenir les éléments des deux tableaux.',
    examples: [
      { input: 'nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3', output: '[1, 2, 2, 3, 5, 6]', explanation: 'Les tableaux [1,2,3] et [2,5,6] sont fusionnés en [1,2,2,3,5,6]' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'Le deuxième tableau est vide, le résultat est le premier tableau' },
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]', explanation: 'Le premier tableau est vide, le résultat est le deuxième tableau' },
    ],
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
      '0 ≤ m, n ≤ 200',
      'Fusionner en place dans nums1',
    ],
  },
  'remove duplicates': {
    description: 'Supprimez les doublons d\'un tableau trié en place. Retournez le nombre d\'éléments uniques.',
    examples: [
      { input: 'nums = [1, 1, 2]', output: '2, nums = [1, 2, _]', explanation: 'Il y a 2 éléments uniques (1 et 2)' },
      { input: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', output: '5, nums = [0, 1, 2, 3, 4, _, _, _, _, _]', explanation: '5 éléments uniques' },
      { input: 'nums = [1]', output: '1, nums = [1]', explanation: 'Un seul élément, donc 1 unique' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 3 × 10⁴',
      '-100 ≤ nums[i] ≤ 100',
      'Le tableau est trié par ordre croissant',
      'Modifier le tableau en place avec O(1) mémoire',
    ],
  },
  'remove element': {
    description: 'Supprimez toutes les occurrences d\'une valeur donnée dans un tableau en place. Retournez le nouveau nombre d\'éléments.',
    examples: [
      { input: 'nums = [3, 2, 2, 3], val = 3', output: '2, nums = [2, 2, _, _]', explanation: 'Les deux 3 sont supprimés, il reste [2, 2]' },
      { input: 'nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2', output: '5, nums = [0, 1, 3, 0, 4, _, _, _]', explanation: 'Les trois 2 sont supprimés' },
      { input: 'nums = [1], val = 1', output: '0, nums = []', explanation: 'L\'unique élément est supprimé' },
    ],
    constraints: [
      '0 ≤ nums.length ≤ 100',
      '0 ≤ nums[i] ≤ 50',
      '0 ≤ val ≤ 100',
      'Modifier le tableau en place',
    ],
  },
  'search insert': {
    description: 'Trouvez la position d\'insertion d\'une valeur cible dans un tableau trié. Si la valeur existe, retournez son indice.',
    examples: [
      { input: 'nums = [1, 3, 5, 6], target = 5', output: '2', explanation: '5 est trouvé à l\'indice 2' },
      { input: 'nums = [1, 3, 5, 6], target = 2', output: '1', explanation: '2 devrait être inséré à l\'indice 1' },
      { input: 'nums = [1, 3, 5, 6], target = 7', output: '4', explanation: '7 devrait être inséré à la fin' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      'Le tableau est trié sans doublons',
      'Complexité attendue : O(log n)',
    ],
  },
  'move zeroes': {
    description: 'Déplacez tous les zéros à la fin du tableau tout en maintenant l\'ordre relatif des autres éléments.',
    examples: [
      { input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]', explanation: 'Les zéros sont déplacés à la fin' },
      { input: 'nums = [0]', output: '[0]', explanation: 'Un seul zéro, rien ne change' },
      { input: 'nums = [1, 2, 3]', output: '[1, 2, 3]', explanation: 'Pas de zéros, le tableau reste identique' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-2³¹ ≤ nums[i] ≤ 2³¹ - 1',
      'Modifier le tableau en place',
      'Minimiser le nombre d\'opérations',
    ],
  },
  'two sum': {
    description: 'Trouvez deux nombres dans le tableau dont la somme égale la cible. Retournez leurs indices.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 3 + 3 = 6' },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Une seule solution valide existe',
      'Un même élément ne peut pas être utilisé deux fois',
    ],
  },
  'contains duplicate': {
    description: 'Déterminez si le tableau contient des doublons. Retournez true si une valeur apparaît au moins deux fois.',
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true', explanation: '1 apparaît deux fois' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false', explanation: 'Tous les éléments sont distincts' },
      { input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true', explanation: 'Plusieurs doublons' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
    ],
  },
  'valid parentheses': {
    description: 'Déterminez si une chaîne de parenthèses est valide. Chaque parenthèse ouvrante doit avoir sa fermante correspondante dans le bon ordre.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Parenthèses correctement fermées' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'Trois paires correctes' },
      { input: 's = "(]"', output: 'false', explanation: 'Mauvaise correspondance' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      's contient uniquement ()[]{}',
      'Utiliser une pile',
    ],
  },
  'reverse string': {
    description: 'Inversez une chaîne de caractères en place.',
    examples: [
      { input: 's = ["h", "e", "l", "l", "o"]', output: '["o", "l", "l", "e", "h"]', explanation: 'La chaîne est inversée' },
      { input: 's = ["H", "a", "n", "n", "a", "h"]', output: '["h", "a", "n", "n", "a", "H"]', explanation: 'Palindrome inversé' },
      { input: 's = ["a"]', output: '["a"]', explanation: 'Un seul caractère reste identique' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 10⁵',
      'Modifier en place avec O(1) mémoire',
      'Utiliser deux pointeurs',
    ],
  },
  'valid palindrome': {
    description: 'Déterminez si une chaîne est un palindrome en ignorant les caractères non alphanumériques et la casse.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" est un palindrome' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" n\'est pas un palindrome' },
      { input: 's = " "', output: 'true', explanation: 'Une chaîne vide est un palindrome' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 2 × 10⁵',
      's contient des caractères ASCII',
      'Ignorer la casse et les caractères non alphanumériques',
    ],
  },
  'binary search': {
    description: 'Implémentez la recherche binaire pour trouver un élément dans un tableau trié. Retournez -1 si non trouvé.',
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 est à l\'indice 4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 n\'est pas dans le tableau' },
      { input: 'nums = [5], target = 5', output: '0', explanation: 'Élément unique trouvé' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      'Le tableau est trié par ordre croissant',
      'Complexité : O(log n)',
    ],
  },
  'maximum subarray': {
    description: 'Trouvez le sous-tableau contigu avec la plus grande somme.',
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: '[4, -1, 2, 1] a la somme maximale 6' },
      { input: 'nums = [1]', output: '1', explanation: 'Un seul élément' },
      { input: 'nums = [5, 4, -1, 7, 8]', output: '23', explanation: 'Tout le tableau [5,4,-1,7,8] = 23' },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      'Algorithme de Kadane en O(n)',
    ],
  },
  'climbing stairs': {
    description: 'Combien de façons différentes pour monter n marches si vous pouvez monter 1 ou 2 marches à la fois ?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '(1+1) ou (2)' },
      { input: 'n = 3', output: '3', explanation: '(1+1+1), (1+2), (2+1)' },
      { input: 'n = 4', output: '5', explanation: '5 combinaisons possibles' },
    ],
    constraints: [
      '1 ≤ n ≤ 45',
      'Suite de Fibonacci',
      'Programmation dynamique recommandée',
    ],
  },
  'best time to buy': {
    description: 'Trouvez le profit maximum en achetant puis vendant une action. Vous ne pouvez effectuer qu\'une seule transaction.',
    examples: [
      { input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5', explanation: 'Acheter à 1, vendre à 6 = profit de 5' },
      { input: 'prices = [7, 6, 4, 3, 1]', output: '0', explanation: 'Prix décroissants, aucun profit possible' },
      { input: 'prices = [2, 4, 1]', output: '2', explanation: 'Acheter à 2, vendre à 4 = profit de 2' },
    ],
    constraints: [
      '1 ≤ prices.length ≤ 10⁵',
      '0 ≤ prices[i] ≤ 10⁴',
      'Une seule transaction autorisée',
    ],
  },
  'linked list': {
    description: 'Manipulez une liste chaînée selon les instructions données.',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[résultat selon l\'opération]', explanation: 'Opération sur la liste chaînée' },
      { input: 'head = [1, 2]', output: '[résultat]', explanation: 'Liste avec deux éléments' },
      { input: 'head = []', output: '[]', explanation: 'Liste vide' },
    ],
    constraints: [
      '0 ≤ nombre de nœuds ≤ 5000',
      '-5000 ≤ Node.val ≤ 5000',
      'Attention aux pointeurs null',
    ],
  },
  'reverse linked': {
    description: 'Inversez une liste chaînée.',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Liste inversée' },
      { input: 'head = [1, 2]', output: '[2, 1]', explanation: 'Deux nœuds inversés' },
      { input: 'head = []', output: '[]', explanation: 'Liste vide reste vide' },
    ],
    constraints: [
      '0 ≤ nombre de nœuds ≤ 5000',
      'Peut être fait itérativement ou récursivement',
      'O(n) temps, O(1) espace pour itératif',
    ],
  },
  'palindrome': {
    description: 'Vérifiez si l\'entrée est un palindrome (se lit de la même façon dans les deux sens).',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 se lit 121 à l\'envers' },
      { input: 'x = -121', output: 'false', explanation: '-121 se lit 121- à l\'envers' },
      { input: 'x = 10', output: 'false', explanation: '10 se lit 01 à l\'envers' },
    ],
    constraints: [
      '-2³¹ ≤ x ≤ 2³¹ - 1',
      'Nombres négatifs ne sont pas des palindromes',
    ],
  },
  'roman to integer': {
    description: 'Convertissez un nombre romain en entier.',
    examples: [
      { input: 's = "III"', output: '3', explanation: 'III = 3' },
      { input: 's = "LVIII"', output: '58', explanation: 'L = 50, V = 5, III = 3' },
      { input: 's = "MCMXCIV"', output: '1994', explanation: 'M = 1000, CM = 900, XC = 90, IV = 4' },
    ],
    constraints: [
      '1 ≤ s.length ≤ 15',
      's contient I, V, X, L, C, D, M',
      '1 ≤ résultat ≤ 3999',
    ],
  },
  'longest common prefix': {
    description: 'Trouvez le plus long préfixe commun parmi un tableau de chaînes.',
    examples: [
      { input: 'strs = ["flower", "flow", "flight"]', output: '"fl"', explanation: 'Le préfixe commun est "fl"' },
      { input: 'strs = ["dog", "racecar", "car"]', output: '""', explanation: 'Aucun préfixe commun' },
      { input: 'strs = ["a"]', output: '"a"', explanation: 'Une seule chaîne' },
    ],
    constraints: [
      '1 ≤ strs.length ≤ 200',
      '0 ≤ strs[i].length ≤ 200',
      'Caractères minuscules anglais',
    ],
  },
};

// Difficulty translations
const DIFFICULTY_FR: Record<string, string> = {
  easy: 'facile',
  medium: 'intermédiaire',
  hard: 'difficile',
};

// Module contexts
const MODULE_CONTEXTS: Record<string, string> = {
  'array-tower': 'manipulation de tableaux',
  'string-plaza': 'manipulation de chaînes de caractères',
  'hash-hub': 'tables de hachage',
  'two-pointers-bridge': 'technique des deux pointeurs',
  'binary-search-center': 'recherche dichotomique',
  'sliding-window-mall': 'fenêtre glissante',
  'sorting-station': 'algorithmes de tri',
  'stack-skyscraper': 'structures de pile',
  'linked-list-factory': 'listes chaînées',
  'queue-warehouse': 'files d\'attente',
  'tree-greenhouse': 'structures arborescentes',
  'bst-laboratory': 'arbres binaires de recherche',
  'heap-refinery': 'tas et files de priorité',
  'dp-datacenter': 'programmation dynamique',
  'backtrack-incubator': 'backtracking',
  'greedy-lab': 'algorithmes gloutons',
  'bitwise-bunker': 'manipulation de bits',
  'math-observatory': 'mathématiques algorithmiques',
};

function findMatchingPattern(title: string): typeof PROBLEM_EXAMPLES[string] | null {
  const lowerTitle = title.toLowerCase();

  for (const [pattern, examples] of Object.entries(PROBLEM_EXAMPLES)) {
    if (lowerTitle.includes(pattern.toLowerCase())) {
      return examples;
    }
  }
  return null;
}

function generateStatementWithOriginal(
  frenchTitle: string,
  originalTitle: string,
  buildingSlug: string,
  difficulty: string
): string {
  const difficultyFr = DIFFICULTY_FR[difficulty] || difficulty;
  const moduleContext = MODULE_CONTEXTS[buildingSlug] || 'algorithmique';

  // Try to find problem-specific examples using ORIGINAL English title
  const specificExamples = findMatchingPattern(originalTitle);

  let statement = `## ${frenchTitle}\n\n`;
  statement += `### Objectif\n`;
  statement += `Ce problème de niveau **${difficultyFr}** porte sur la **${moduleContext}**.\n\n`;

  if (specificExamples) {
    statement += `### Description\n`;
    statement += `${specificExamples.description}\n\n`;

    statement += `### Exemples\n\n`;
    specificExamples.examples.forEach((ex, i) => {
      statement += `**Exemple ${i + 1}:**\n`;
      statement += `- **Entrée** : \`${ex.input}\`\n`;
      statement += `- **Sortie** : \`${ex.output}\`\n`;
      statement += `- **Explication** : ${ex.explanation}\n\n`;
    });

    statement += `### Contraintes\n\n`;
    specificExamples.constraints.forEach(c => {
      statement += `- ${c}\n`;
    });
  } else {
    // Generic fallback
    statement += `### Description\n`;
    statement += `Implémentez une solution efficace pour résoudre ce problème.\n\n`;
    statement += `Analysez les entrées et produisez la sortie attendue.\n\n`;

    statement += `### Conseils\n`;
    statement += `- Commencez par analyser les cas simples\n`;
    statement += `- Identifiez les patterns et cas particuliers\n`;
    statement += `- Pensez à la complexité temporelle et spatiale\n\n`;

    statement += `### Contraintes\n\n`;
    statement += `- Respectez les limites de temps et de mémoire\n`;
    statement += `- Gérez les cas limites (vide, un élément, etc.)\n`;
  }

  return statement;
}

async function updateSpecificExamples() {
  console.log('🚀 ALGOBOG Problem-Specific Examples Updater');
  console.log('=============================================\n');

  let offset = 0;
  const limit = 100;
  let totalUpdated = 0;
  let specificMatches = 0;
  let totalProcessed = 0;

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'algo-problems',
      [Query.limit(limit), Query.offset(offset), Query.orderAsc('order')]
    );

    if (response.documents.length === 0) break;

    for (const doc of response.documents) {
      const title = doc.title as string;
      const leetcodeTitle = doc.leetcodeTitle as string || title;
      const buildingSlug = doc.buildingSlug as string;
      const difficulty = doc.difficulty as string;

      // Use leetcodeTitle (English) for pattern matching, but display French title
      const statement = generateStatementWithOriginal(title, leetcodeTitle, buildingSlug, difficulty);

      // Check if we found specific examples
      if (findMatchingPattern(leetcodeTitle)) {
        specificMatches++;
      }

      await databases.updateDocument(
        DATABASE_ID,
        'algo-problems',
        doc.$id,
        { statement }
      );

      totalUpdated++;
      totalProcessed++;

      if (totalProcessed % 100 === 0) {
        console.log(`   Processed: ${totalProcessed} problems (${specificMatches} with specific examples)`);
      }
    }

    offset += limit;

    if (response.documents.length < limit) break;
  }

  console.log(`\n✅ Updated ${totalUpdated} problems`);
  console.log(`   ${specificMatches} with problem-specific examples`);
  console.log(`   ${totalUpdated - specificMatches} with generic examples`);
}

updateSpecificExamples().catch(console.error);
