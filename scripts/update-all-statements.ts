/**
 * Update ALL ALGOBOG problem statements with proper French descriptions,
 * examples (input/output/explanation) and constraints.
 *
 * Uses leetcode-problems-data.json for known problems,
 * generates module-based examples for others.
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Load known problems data
const PROBLEMS_DATA: Record<string, {
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
}> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'leetcode-problems-data.json'), 'utf-8')
);

const DIFFICULTY_FR: Record<string, string> = {
  easy: 'facile',
  medium: 'intermédiaire',
  hard: 'difficile',
};

// ============================================================================
// TITLE TRANSLATION
// ============================================================================

// Full title translations for known problems
const TITLE_OVERRIDES: Record<string, string> = {
  'Two Sum': 'Somme de Deux',
  'Three Sum': 'Somme de Trois',
  'Add Two Numbers': 'Additionner Deux Nombres',
  'Longest Substring Without Repeating Characters': 'Plus Longue Sous-chaîne Sans Répétition',
  'Median of Two Sorted Arrays': 'Médiane de Deux Tableaux Triés',
  'Longest Palindromic Substring': 'Plus Longue Sous-chaîne Palindrome',
  'Reverse Integer': 'Inverser un Entier',
  'String to Integer': 'Chaîne vers Entier',
  'Palindrome Number': 'Nombre Palindrome',
  'Regular Expression Matching': 'Correspondance d\'Expression Régulière',
  'Container With Most Water': 'Conteneur Avec le Plus d\'Eau',
  'Roman to Integer': 'Romain vers Entier',
  'Integer to Roman': 'Entier vers Romain',
  'Longest Common Prefix': 'Plus Long Préfixe Commun',
  'Valid Parentheses': 'Parenthèses Valides',
  'Merge Two Sorted Lists': 'Fusionner Deux Listes Triées',
  'Generate Parentheses': 'Générer des Parenthèses',
  'Merge k Sorted Lists': 'Fusionner k Listes Triées',
  'Remove Duplicates': 'Supprimer les Doublons',
  'Remove Duplicates from Sorted Array': 'Supprimer les Doublons d\'un Tableau Trié',
  'Remove Element': 'Supprimer un Élément',
  'Search Insert Position': 'Position d\'Insertion',
  'Valid Sudoku': 'Sudoku Valide',
  'Combination Sum': 'Somme de Combinaisons',
  'First Missing Positive': 'Premier Positif Manquant',
  'Trapping Rain Water': 'Piéger l\'Eau de Pluie',
  'Group Anagrams': 'Grouper les Anagrammes',
  'Maximum Subarray': 'Sous-tableau Maximum',
  'Spiral Matrix': 'Matrice en Spirale',
  'Jump Game': 'Jeu de Saut',
  'Merge Intervals': 'Fusionner les Intervalles',
  'Unique Paths': 'Chemins Uniques',
  'Minimum Path Sum': 'Somme du Chemin Minimum',
  'Climbing Stairs': 'Monter les Escaliers',
  'Sort Colors': 'Trier les Couleurs',
  'Minimum Window Substring': 'Plus Petite Fenêtre Contenant',
  'Subsets': 'Sous-ensembles',
  'Word Search': 'Recherche de Mot',
  'Merge Sorted Array': 'Fusionner des Tableaux Triés',
  'Binary Tree Inorder Traversal': 'Parcours Infixe d\'Arbre Binaire',
  'Validate Binary Search Tree': 'Valider un Arbre Binaire de Recherche',
  'Symmetric Tree': 'Arbre Symétrique',
  'Binary Tree Level Order Traversal': 'Parcours par Niveaux d\'Arbre Binaire',
  'Maximum Depth of Binary Tree': 'Profondeur Maximale d\'Arbre Binaire',
  'Best Time to Buy and Sell Stock': 'Meilleur Moment pour Acheter et Vendre',
  'Linked List Cycle': 'Cycle dans une Liste Chaînée',
  'LRU Cache': 'Cache LRU',
  'Sort List': 'Trier une Liste',
  'Min Stack': 'Pile Minimum',
  'Intersection of Two Linked Lists': 'Intersection de Deux Listes Chaînées',
  'Majority Element': 'Élément Majoritaire',
  'Reverse Linked List': 'Inverser une Liste Chaînée',
  'Implement Trie': 'Implémenter un Trie',
  'Course Schedule': 'Emploi du Temps',
  'Kth Largest Element': 'K-ième Plus Grand Élément',
  'Invert Binary Tree': 'Inverser un Arbre Binaire',
  'Lowest Common Ancestor': 'Plus Proche Ancêtre Commun',
  'Product of Array Except Self': 'Produit du Tableau Sauf Soi-même',
  'Sliding Window Maximum': 'Maximum de Fenêtre Glissante',
  'Search a 2D Matrix': 'Recherche dans une Matrice 2D',
  'Perfect Squares': 'Carrés Parfaits',
  'Move Zeroes': 'Déplacer les Zéros',
  'Find Median from Data Stream': 'Trouver la Médiane d\'un Flux',
  'Longest Increasing Subsequence': 'Plus Longue Sous-séquence Croissante',
  'Coin Change': 'Rendu de Monnaie',
  'Number of Islands': 'Nombre d\'Îles',
  'House Robber': 'Cambrioleur de Maisons',
  'Word Break': 'Découpe de Mots',
  'Copy List with Random Pointer': 'Copier Liste avec Pointeur Aléatoire',
  'Word Ladder': 'Échelle de Mots',
  'Longest Consecutive Sequence': 'Plus Longue Séquence Consécutive',
  'Gas Station': 'Station-service',
  'Single Number': 'Nombre Unique',
  'Clone Graph': 'Cloner un Graphe',
  'Surrounded Regions': 'Régions Entourées',
  'Palindrome Partitioning': 'Partition en Palindromes',
  'Rotate Array': 'Rotation de Tableau',
  'Reverse Bits': 'Inverser les Bits',
  'Number of 1 Bits': 'Nombre de Bits à 1',
  'Happy Number': 'Nombre Heureux',
  'Remove Linked List Elements': 'Supprimer des Éléments de Liste Chaînée',
  'Count Primes': 'Compter les Nombres Premiers',
  'Power of Two': 'Puissance de Deux',
  'Implement Queue using Stacks': 'Implémenter une File avec des Piles',
  'Implement Stack using Queues': 'Implémenter une Pile avec des Files',
  'Delete Node in a Linked List': 'Supprimer un Nœud de Liste Chaînée',
  'Missing Number': 'Nombre Manquant',
  'Ugly Number': 'Nombre Laid',
  'First Bad Version': 'Première Mauvaise Version',
  'Flatten Nested List Iterator': 'Aplatir un Itérateur de Liste Imbriquée',
  'Top K Frequent Elements': 'K Éléments les Plus Fréquents',
  'Intersection of Two Arrays': 'Intersection de Deux Tableaux',
  'Reverse String': 'Inverser une Chaîne',
  'Reverse Vowels': 'Inverser les Voyelles',
  'Valid Perfect Square': 'Carré Parfait Valide',
  'Find the Duplicate Number': 'Trouver le Nombre en Double',
  'Ransom Note': 'Lettre de Rançon',
  'Longest Palindrome': 'Plus Long Palindrome',
  'Fizz Buzz': 'Fizz Buzz',
  'Third Maximum Number': 'Troisième Maximum',
  'Add Strings': 'Additionner des Chaînes',
  'Partition Equal Subset Sum': 'Partition en Sous-ensembles Égaux',
  'Battleships in a Board': 'Navires sur un Plateau',
  'Find All Numbers Disappeared': 'Trouver les Nombres Disparus',
  'Assign Cookies': 'Distribuer les Cookies',
  'Path Sum': 'Somme du Chemin',
  'Open the Lock': 'Ouvrir le Cadenas',
  'Sliding Puzzle': 'Puzzle Glissant',
  'Is Graph Bipartite?': 'Graphe Biparti ?',
  'Network Delay Time': 'Temps de Délai Réseau',
  'Cheapest Flights Within K Stops': 'Vols les Moins Chers en K Escales',
  'Rotting Oranges': 'Oranges Pourries',
  'Permutations': 'Permutations',
  'Combinations': 'Combinaisons',
  'N-Queens': 'N Reines',
  'Sudoku Solver': 'Résolveur de Sudoku',
  'Letter Combinations of a Phone Number': 'Combinaisons de Lettres d\'un Numéro',
  'Decode Ways': 'Façons de Décoder',
  'Edit Distance': 'Distance d\'Édition',
  'Longest Common Subsequence': 'Plus Longue Sous-séquence Commune',
  'Target Sum': 'Somme Cible',
  'Unique Binary Search Trees': 'Arbres Binaires de Recherche Uniques',
  'Interleaving String': 'Chaîne Entrelacée',
  'Maximal Square': 'Carré Maximal',
  'Range Sum Query': 'Requête de Somme d\'Intervalle',
  'Count of Smaller Numbers After Self': 'Compter les Plus Petits Après',
  'Container with Most Water': 'Conteneur avec le Plus d\'Eau',
  'Maximum Product Subarray': 'Sous-tableau au Produit Maximum',
  'Find Peak Element': 'Trouver l\'Élément Pic',
  'Contains Duplicate': 'Contient des Doublons',
  'Plus One': 'Ajouter Un',
  'Binary Search': 'Recherche Binaire',
  'Valid Palindrome': 'Palindrome Valide',
  'Pascal\'s Triangle': 'Triangle de Pascal',
  'Single Element in a Sorted Array': 'Élément Unique dans un Tableau Trié',
  'Rotate Image': 'Rotation d\'Image',
  'Set Matrix Zeroes': 'Mettre la Matrice à Zéro',
  'Game of Life': 'Jeu de la Vie',
  'Implement strStr': 'Implémenter strStr',
  'Pow(x, n)': 'Puissance(x, n)',
  'Sqrt(x)': 'Racine Carrée(x)',
  'Daily Temperatures': 'Températures Quotidiennes',
  'Next Greater Element': 'Prochain Élément Plus Grand',
  'Evaluate Reverse Polish Notation': 'Évaluer la Notation Polonaise Inversée',
  'Decode String': 'Décoder une Chaîne',
  'Asteroid Collision': 'Collision d\'Astéroïdes',
  'Basic Calculator': 'Calculatrice de Base',
  'Largest Rectangle in Histogram': 'Plus Grand Rectangle dans un Histogramme',
  'Middle of the Linked List': 'Milieu de la Liste Chaînée',
  'Palindrome Linked List': 'Liste Chaînée Palindrome',
  'Odd Even Linked List': 'Liste Chaînée Pair-Impair',
  'Flatten a Multilevel Doubly Linked List': 'Aplatir une Liste Doublement Chaînée',
  'Swap Nodes in Pairs': 'Échanger les Nœuds par Paires',
  'Design Circular Queue': 'Concevoir une File Circulaire',
  'Design Circular Deque': 'Concevoir un Deque Circulaire',
  'Same Tree': 'Arbres Identiques',
  'Path Sum III': 'Somme du Chemin III',
  'Diameter of Binary Tree': 'Diamètre d\'Arbre Binaire',
  'Construct Binary Tree from Preorder and Inorder': 'Construire un Arbre depuis Préfixe et Infixe',
  'Kth Smallest Element in a BST': 'K-ième Plus Petit Élément dans un BST',
  'Serialize and Deserialize Binary Tree': 'Sérialiser et Désérialiser un Arbre',
  'Delete Node in a BST': 'Supprimer un Nœud dans un BST',
  'Convert Sorted Array to BST': 'Convertir un Tableau Trié en BST',
  'Find Kth Largest': 'Trouver le K-ième Plus Grand',
  'Sort Characters By Frequency': 'Trier les Caractères par Fréquence',
  'Reorganize String': 'Réorganiser une Chaîne',
  'Design Twitter': 'Concevoir Twitter',
  'Map Sum Pairs': 'Paires de Somme de Map',
  'Replace Words': 'Remplacer les Mots',
  'Design Add and Search Words': 'Concevoir Ajout et Recherche de Mots',
  'Shortest Bridge': 'Plus Court Pont',
  'Walls and Gates': 'Murs et Portes',
  'Pacific Atlantic Water Flow': 'Flux d\'Eau Pacifique Atlantique',
  'All Paths From Source to Target': 'Tous les Chemins de Source à Cible',
  'Flood Fill': 'Remplissage par Diffusion',
  'Accounts Merge': 'Fusionner les Comptes',
  'Redundant Connection': 'Connexion Redondante',
  'Number of Connected Components': 'Nombre de Composantes Connexes',
  'Number of Provinces': 'Nombre de Provinces',
  'Course Schedule II': 'Emploi du Temps II',
  'Alien Dictionary': 'Dictionnaire Extraterrestre',
  'Minimum Height Trees': 'Arbres de Hauteur Minimale',
  'Find the Town Judge': 'Trouver le Juge de la Ville',
  'Path with Maximum Probability': 'Chemin avec Probabilité Maximale',
  'Swim in Rising Water': 'Nager dans l\'Eau Montante',
};

// Word-level fallback translations for titles not in TITLE_OVERRIDES
const WORD_TRANSLATIONS: [RegExp, string][] = [
  [/\bMaximum\b/gi, 'Maximum'],
  [/\bMinimum\b/gi, 'Minimum'],
  [/\bFind\b/gi, 'Trouver'],
  [/\bCount\b/gi, 'Compter'],
  [/\bSort\b/gi, 'Trier'],
  [/\bMerge\b/gi, 'Fusionner'],
  [/\bSplit\b/gi, 'Diviser'],
  [/\bRotate\b/gi, 'Rotation'],
  [/\bReverse\b/gi, 'Inverser'],
  [/\bSum\b/gi, 'Somme'],
  [/\bProduct\b/gi, 'Produit'],
  [/\bLongest\b/gi, 'Plus Long'],
  [/\bShortest\b/gi, 'Plus Court'],
  [/\bFirst\b/gi, 'Premier'],
  [/\bLast\b/gi, 'Dernier'],
  [/\bUnique\b/gi, 'Unique'],
  [/\bCommon\b/gi, 'Commun'],
  [/\bMissing\b/gi, 'Manquant'],
  [/\bDuplicate\b/gi, 'Doublon'],
  [/\bSubarray\b/gi, 'Sous-tableau'],
  [/\bSubstring\b/gi, 'Sous-chaîne'],
  [/\bSubsequence\b/gi, 'Sous-séquence'],
  [/\bPath\b/gi, 'Chemin'],
  [/\bTree\b/gi, 'Arbre'],
  [/\bNode\b/gi, 'Nœud'],
  [/\bLinked List\b/gi, 'Liste Chaînée'],
  [/\bList\b/gi, 'Liste'],
  [/\bArray\b/gi, 'Tableau'],
  [/\bString\b/gi, 'Chaîne'],
  [/\bNumber\b/gi, 'Nombre'],
  [/\bInteger\b/gi, 'Entier'],
  [/\bMatrix\b/gi, 'Matrice'],
  [/\bGrid\b/gi, 'Grille'],
  [/\bGraph\b/gi, 'Graphe'],
  [/\bStack\b/gi, 'Pile'],
  [/\bQueue\b/gi, 'File'],
  [/\bHeap\b/gi, 'Tas'],
  [/\bValid\b/gi, 'Valide'],
  [/\bSearch\b/gi, 'Recherche'],
  [/\bDelete\b/gi, 'Supprimer'],
  [/\bInsert\b/gi, 'Insérer'],
  [/\bRemove\b/gi, 'Supprimer'],
  [/\bDesign\b/gi, 'Concevoir'],
  [/\bImplement\b/gi, 'Implémenter'],
  [/\bConvert\b/gi, 'Convertir'],
  [/\bCheck\b/gi, 'Vérifier'],
  [/\bDetect\b/gi, 'Détecter'],
  [/\bClone\b/gi, 'Cloner'],
  [/\bCopy\b/gi, 'Copier'],
  [/\bFlatten\b/gi, 'Aplatir'],
  [/\bBalance\b/gi, 'Équilibrer'],
  [/\bBalanced\b/gi, 'Équilibré'],
  [/\bDepth\b/gi, 'Profondeur'],
  [/\bLevel\b/gi, 'Niveau'],
  [/\bOrder\b/gi, 'Ordre'],
  [/\bWeight\b/gi, 'Poids'],
  [/\bSorted\b/gi, 'Trié'],
  [/\bBinary\b/gi, 'Binaire'],
  [/\bCircular\b/gi, 'Circulaire'],
  [/\bConnected\b/gi, 'Connexe'],
  [/\bComponents?\b/gi, 'Composantes'],
  [/\bIslands?\b/gi, 'Îles'],
  [/\bWater\b/gi, 'Eau'],
  [/\bRain\b/gi, 'Pluie'],
  [/\bStairs\b/gi, 'Escaliers'],
  [/\bClimbing\b/gi, 'Monter'],
  [/\bJump\b/gi, 'Saut'],
  [/\bGame\b/gi, 'Jeu'],
  [/\bRobber\b/gi, 'Cambrioleur'],
  [/\bHouse\b/gi, 'Maison'],
  [/\bCoin\b/gi, 'Pièce'],
  [/\bChange\b/gi, 'Monnaie'],
  [/\bWord\b/gi, 'Mot'],
  [/\bBreak\b/gi, 'Découpe'],
  [/\bLetter\b/gi, 'Lettre'],
  [/\bDecode\b/gi, 'Décoder'],
  [/\bOpen\b/gi, 'Ouvrir'],
  [/\bLock\b/gi, 'Cadenas'],
  [/\bPuzzle\b/gi, 'Puzzle'],
  [/\bSliding\b/gi, 'Glissant'],
  [/\bWindow\b/gi, 'Fenêtre'],
  [/\bDaily\b/gi, 'Quotidien'],
  [/\bTemperature\b/gi, 'Température'],
  [/\bNext\b/gi, 'Prochain'],
  [/\bGreater\b/gi, 'Plus Grand'],
  [/\bSmaller\b/gi, 'Plus Petit'],
  [/\bElement\b/gi, 'Élément'],
  [/\bPeak\b/gi, 'Pic'],
  [/\bTarget\b/gi, 'Cible'],
  [/\bDistance\b/gi, 'Distance'],
  [/\bEdit\b/gi, 'Édition'],
  [/\bPartition\b/gi, 'Partition'],
  [/\bSquare\b/gi, 'Carré'],
  [/\bPower\b/gi, 'Puissance'],
  [/\bFloor\b/gi, 'Plancher'],
  [/\bCeiling\b/gi, 'Plafond'],
  [/\bMedian\b/gi, 'Médiane'],
  [/\bAverage\b/gi, 'Moyenne'],
  [/\bRange\b/gi, 'Intervalle'],
  [/\bQuery\b/gi, 'Requête'],
  [/\bUpdate\b/gi, 'Mise à Jour'],
  [/\band\b/gi, 'et'],
  [/\bor\b/gi, 'ou'],
  [/\bof\b/gi, 'de'],
  [/\bthe\b/gi, 'le'],
  [/\bin\b/gi, 'dans'],
  [/\bfrom\b/gi, 'depuis'],
  [/\bto\b/gi, 'vers'],
  [/\bwith\b/gi, 'avec'],
  [/\bWithout\b/gi, 'Sans'],
  [/\bAll\b/gi, 'Tous'],
  [/\bBetween\b/gi, 'Entre'],
  [/\bAfter\b/gi, 'Après'],
  [/\bBefore\b/gi, 'Avant'],
  [/\bUsing\b/gi, 'Utilisant'],
  [/\bKth\b/gi, 'K-ième'],
];

function translateTitle(englishTitle: string): string {
  // Check for exact match first
  if (TITLE_OVERRIDES[englishTitle]) {
    return TITLE_OVERRIDES[englishTitle];
  }

  // Word-level translation as fallback
  let result = englishTitle;
  for (const [pattern, replacement] of WORD_TRANSLATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function difficultyPrefix(diff: string): string {
  const fr = DIFFICULTY_FR[diff] || diff;
  // Élision : "de intermédiaire" → "d'intermédiaire"
  if (fr.startsWith('i') || fr.startsWith('a') || fr.startsWith('e') || fr.startsWith('u') || fr.startsWith('o')) {
    return `d'${fr}`;
  }
  return `de ${fr}`;
}

// Module-specific example generators for problems NOT in the JSON
// title = French title, difficulty = 'easy'|'medium'|'hard'
const MODULE_GENERATORS: Record<string, (title: string, difficulty: string) => {
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
}> = {
  // PHASE 1 - Downtown
  'array-tower': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les tableaux. Manipulez un tableau d'entiers pour obtenir le résultat demandé.`,
    examples: [
      { input: 'nums = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Parcourir et transformer le tableau' },
      { input: 'nums = [3, 1, 4, 1, 5]', output: '[1, 1, 3, 4, 5]', explanation: 'Traitement selon la consigne' },
      { input: 'nums = [1]', output: '[1]', explanation: 'Cas avec un seul élément' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹'],
  }),
  'string-plaza': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les chaînes de caractères. Analysez ou transformez la chaîne donnée.`,
    examples: [
      { input: 's = "hello"', output: '"olleh"', explanation: 'Traitement de la chaîne selon la consigne' },
      { input: 's = "A man a plan"', output: 'true', explanation: 'Vérification ou transformation appliquée' },
      { input: 's = ""', output: '""', explanation: 'Chaîne vide - cas limite' },
    ],
    constraints: ['0 ≤ s.length ≤ 10⁵', 's contient des caractères ASCII imprimables'],
  }),
  'hash-hub': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} utilisant des tables de hachage. Utilisez un dictionnaire pour un accès rapide aux données.`,
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true', explanation: 'Le HashMap détecte le doublon en O(1)' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false', explanation: 'Aucun doublon trouvé après parcours complet' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'Complexité attendue : O(n) avec un HashMap'],
  }),
  'two-pointers-bridge': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec la technique des deux pointeurs. Utilisez deux indices qui convergent ou divergent pour résoudre le problème.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Les deux pointeurs trouvent la paire dont la somme vaut target' },
      { input: 'nums = [-1, 0, 1, 2, -1, -4]', output: '[[-1, -1, 2], [-1, 0, 1]]', explanation: 'Tri + deux pointeurs pour trouver les triplets' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', 'Tableau trié ou triable', 'Complexité O(n) ou O(n²)'],
  }),
  'binary-search-center': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec la recherche dichotomique. Divisez l'espace de recherche par deux à chaque étape.`,
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: 'Trouvé à l\'indice 4 par dichotomie' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: 'Élément absent du tableau' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁴', 'Tableau trié en ordre croissant', 'Complexité O(log n)'],
  }),
  'sliding-window-mall': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec la technique de fenêtre glissante. Maintenez une fenêtre de taille variable ou fixe sur les données.`,
    examples: [
      { input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', output: '[3, 3, 5, 5, 6, 7]', explanation: 'Maximum dans chaque fenêtre de taille 3' },
      { input: 's = "abcabcbb"', output: '3', explanation: 'Plus longue sous-chaîne sans répétition : "abc"' },
    ],
    constraints: ['1 ≤ longueur ≤ 10⁵', 'Complexité O(n) avec fenêtre glissante'],
  }),
  'sorting-station': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les algorithmes de tri. Triez ou exploitez le tri pour résoudre le problème.`,
    examples: [
      { input: 'nums = [5, 2, 3, 1]', output: '[1, 2, 3, 5]', explanation: 'Tri par ordre croissant' },
      { input: 'intervals = [[1,3], [2,6], [8,10], [15,18]]', output: '[[1,6], [8,10], [15,18]]', explanation: 'Tri par début puis fusion des intervalles qui se chevauchent' },
    ],
    constraints: ['1 ≤ longueur ≤ 5 × 10⁴', 'Complexité O(n log n)'],
  }),
  'stack-skyscraper': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} utilisant une pile (stack). Utilisez le principe LIFO pour traiter les données.`,
    examples: [
      { input: 's = "([{}])"', output: 'true', explanation: 'Chaque ouvrante a sa fermante dans le bon ordre' },
      { input: 'tokens = ["2", "1", "+", "3", "*"]', output: '9', explanation: 'Notation polonaise inversée : (2 + 1) * 3 = 9' },
    ],
    constraints: ['1 ≤ longueur ≤ 10⁴', 'Utiliser une pile LIFO'],
  }),

  // PHASE 2 - Industrial
  'linked-list-factory': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les listes chaînées. Manipulez les pointeurs pour transformer la liste.`,
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Inverser les pointeurs de la liste' },
      { input: 'head = [1, 2, 3, 4, 5], n = 2', output: '[1, 2, 3, 5]', explanation: 'Supprimer le 2ème nœud depuis la fin' },
    ],
    constraints: ['0 ≤ nombre de nœuds ≤ 5000', '-10³ ≤ Node.val ≤ 10³', 'Attention aux pointeurs null'],
  }),
  'queue-warehouse': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} utilisant une file d'attente (queue). Traitez les éléments dans l'ordre d'arrivée (FIFO).`,
    examples: [
      { input: 'operations = ["push 1", "push 2", "pop", "peek"]', output: '[1, 2]', explanation: 'pop retourne 1 (premier entré), peek retourne 2' },
      { input: 'stream = [1, 3, 2, 4], k = 3', output: '[_, _, 2, 3]', explanation: 'La médiane de la fenêtre glissante de taille k' },
    ],
    constraints: ['1 ≤ nombre d\'opérations ≤ 10⁴', 'Utiliser une file FIFO'],
  }),
  'tree-greenhouse': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les arbres binaires. Parcourez ou transformez l'arbre selon la consigne.`,
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '3', explanation: 'Profondeur maximale de l\'arbre = 3 niveaux' },
      { input: 'root = [1, 2, 3]', output: '[[1], [2, 3]]', explanation: 'Parcours par niveaux (BFS)' },
    ],
    constraints: ['0 ≤ nombre de nœuds ≤ 10⁴', '-100 ≤ Node.val ≤ 100'],
  }),
  'bst-laboratory': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les arbres binaires de recherche (BST). Exploitez la propriété : gauche < parent < droite.`,
    examples: [
      { input: 'root = [4, 2, 7, 1, 3], val = 2', output: '[2, 1, 3]', explanation: 'Sous-arbre trouvé grâce à la propriété BST' },
      { input: 'root = [5, 3, 6, 2, 4, null, null, 1]', output: 'true', explanation: 'L\'arbre respecte la propriété BST' },
    ],
    constraints: ['Propriété BST : gauche < parent < droite', '0 ≤ nombre de nœuds ≤ 10⁴', 'Complexité O(h) où h = hauteur'],
  }),
  'heap-refinery': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} utilisant un tas (heap) ou une file de priorité. Accédez au minimum ou maximum en O(1).`,
    examples: [
      { input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5', explanation: 'Le 2ème plus grand élément est 5' },
      { input: 'lists = [[1,4,5], [1,3,4], [2,6]]', output: '[1, 1, 2, 3, 4, 4, 5, 6]', explanation: 'Fusion de k listes triées avec un min-heap' },
    ],
    constraints: ['Utiliser un heap (min ou max)', '1 ≤ k ≤ longueur', 'Complexité O(n log k)'],
  }),
  'trie-telecom': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} utilisant un arbre préfixe (Trie). Stockez et recherchez des mots par préfixe.`,
    examples: [
      { input: 'insert("apple"), search("apple"), startsWith("app")', output: 'true, true', explanation: '"apple" est présent et commence par "app"' },
      { input: 'words = ["abc", "ab", "abcd"], prefix = "ab"', output: '["abc", "ab", "abcd"]', explanation: 'Tous les mots commençant par "ab"' },
    ],
    constraints: ['1 ≤ longueur du mot ≤ 2000', 'Lettres minuscules a-z', 'Complexité O(m) par opération, m = longueur du mot'],
  }),

  // PHASE 3 - Transit
  'bfs-metro': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec un parcours en largeur (BFS). Explorez le graphe ou la grille niveau par niveau.`,
    examples: [
      { input: 'grid = [[0,1],[1,0]], start = (0,0), end = (1,1)', output: '2', explanation: 'Distance minimale en 2 étapes via BFS' },
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]', explanation: 'Parcours par niveaux de l\'arbre' },
    ],
    constraints: ['Utiliser une file pour le BFS', 'Complexité O(V + E)', 'Marquer les nœuds visités'],
  }),
  'dfs-tunnel': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec un parcours en profondeur (DFS). Explorez chaque branche jusqu'au bout avant de revenir.`,
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'DFS identifie 2 îles distinctes' },
      { input: 'graph = [[1,2],[0],[0]], start = 0', output: '[0, 1, 2]', explanation: 'DFS parcourt tous les nœuds accessibles' },
    ],
    constraints: ['Utiliser récursion ou pile pour DFS', 'Complexité O(V + E)', 'Gérer les cycles avec un set de visités'],
  }),
  'topo-terminal': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec le tri topologique. Ordonnez les nœuds d'un graphe dirigé acyclique (DAG).`,
    examples: [
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0, 1, 2, 3]', explanation: 'Ordre valide respectant toutes les dépendances' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: '[]', explanation: 'Cycle détecté : impossible de suivre tous les cours' },
    ],
    constraints: ['1 ≤ numCourses ≤ 2000', 'Le graphe peut contenir des cycles', 'Complexité O(V + E)'],
  }),
  'union-junction': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec Union-Find (ensemble disjoint). Regroupez les éléments connectés.`,
    examples: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2', explanation: 'Deux composantes connexes : {0,1,2} et {3,4}' },
      { input: 'n = 4, edges = [[0,1],[0,2],[1,2]]', output: '2', explanation: 'Composantes : {0,1,2} et {3}' },
    ],
    constraints: ['Union par rang et compression de chemin', '1 ≤ n ≤ 10⁵', 'Complexité quasi O(1) par opération (amortie)'],
  }),
  'shortest-path-highway': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les plus courts chemins. Trouvez le chemin optimal dans un graphe pondéré.`,
    examples: [
      { input: 'graph = [[1,2,4],[1,3,1],[3,2,2]], start = 1, end = 2', output: '3', explanation: 'Chemin 1→3→2 de coût 1+2=3 (Dijkstra)' },
      { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2', explanation: 'Temps pour atteindre tous les nœuds depuis k' },
    ],
    constraints: ['Poids des arêtes ≥ 0 (Dijkstra) ou quelconques (Bellman-Ford)', 'Complexité O((V + E) log V) avec Dijkstra'],
  }),

  // PHASE 4 - Tech Park
  'backtrack-incubator': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec le backtracking. Explorez toutes les solutions possibles et revenez en arrière si nécessaire.`,
    examples: [
      { input: 'nums = [1, 2, 3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'Toutes les permutations de [1,2,3]' },
      { input: 'candidates = [2, 3, 6, 7], target = 7', output: '[[2,2,3], [7]]', explanation: 'Combinaisons dont la somme vaut 7' },
    ],
    constraints: ['Explorer toutes les possibilités', 'Élaguer les branches impossibles', 'Complexité exponentielle typique'],
  }),
  'dp-datacenter': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec la programmation dynamique (DP). Décomposez en sous-problèmes et mémoïsez les résultats.`,
    examples: [
      { input: 'n = 10', output: '55', explanation: 'Fibonacci(10) = 55, calculé avec dp[i] = dp[i-1] + dp[i-2]' },
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: 'Minimum de pièces : 5 + 5 + 1 = 11' },
    ],
    constraints: ['Définir la relation de récurrence', 'Utiliser mémoïsation (top-down) ou tabulation (bottom-up)', 'Complexité typique O(n²) ou O(n × m)'],
  }),
  'segment-server': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec les arbres de segments (Segment Tree). Effectuez des requêtes d'intervalle et des mises à jour.`,
    examples: [
      { input: 'nums = [1, 3, 5, 7, 9, 11], query(1, 3)', output: '15', explanation: 'Somme des éléments de l\'indice 1 à 3 : 3+5+7=15' },
      { input: 'nums = [2, 1, 5, 3], update(1, 4), query(0, 2)', output: '11', explanation: 'Après mise à jour : [2,4,5,3], somme(0,2)=2+4+5=11' },
    ],
    constraints: ['Construction O(n)', 'Requête et mise à jour O(log n)', '1 ≤ n ≤ 10⁵'],
  }),
  'fenwick-firewall': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec les arbres de Fenwick (BIT - Binary Indexed Tree). Calculez des sommes préfixes efficacement.`,
    examples: [
      { input: 'nums = [1, 3, 5], update(1, 2), sumRange(0, 2)', output: '11', explanation: 'Après update : [1,5,5], somme = 1+5+5 = 11' },
      { input: 'nums = [2, 4, 1, 3, 5], sumRange(1, 3)', output: '8', explanation: 'Somme de l\'indice 1 à 3 : 4+1+3 = 8' },
    ],
    constraints: ['Construction O(n log n)', 'Mise à jour et requête O(log n)', '1 ≤ n ≤ 10⁵'],
  }),
  'dp2d-mainframe': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec la programmation dynamique 2D. Utilisez une matrice dp[i][j] pour résoudre le problème.`,
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: 'Plus longue sous-séquence commune : "ace" (longueur 3)' },
      { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7', explanation: 'Chemin de somme minimale : 1→3→1→1→1 = 7' },
    ],
    constraints: ['dp[i][j] dépend de dp[i-1][j], dp[i][j-1] ou dp[i-1][j-1]', 'Complexité O(m × n)', '1 ≤ m, n ≤ 10³'],
  }),

  // PHASE 5 - Research
  'greedy-lab': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec un algorithme glouton (greedy). Faites le meilleur choix local à chaque étape.`,
    examples: [
      { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: 'Retirer 1 intervalle ([1,3]) pour éliminer les chevauchements' },
      { input: 'nums = [2, 3, 1, 1, 4]', output: '2', explanation: 'Minimum de sauts : indice 0→1→4 (2 sauts)' },
    ],
    constraints: ['Le choix glouton doit mener à l\'optimal global', 'Complexité typique O(n log n) avec tri préalable'],
  }),
  'bitwise-bunker': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} avec des opérations binaires (bitwise). Manipulez les bits pour résoudre le problème.`,
    examples: [
      { input: 'n = 11 (binaire : 1011)', output: '3', explanation: 'Le nombre 11 a 3 bits à 1' },
      { input: 'nums = [4, 1, 2, 1, 2]', output: '4', explanation: 'XOR de tous : seul 4 n\'est pas en double' },
    ],
    constraints: ['Utiliser AND (&), OR (|), XOR (^), NOT (~), shifts (<<, >>)', '0 ≤ n ≤ 2³¹ - 1'],
  }),
  'math-observatory': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} de mathématiques et logique. Appliquez des propriétés mathématiques pour optimiser la solution.`,
    examples: [
      { input: 'n = 12', output: '[2, 2, 3]', explanation: 'Facteurs premiers de 12' },
      { input: 'x = 2.0, n = 10', output: '1024.0', explanation: 'pow(2, 10) = 1024 en O(log n)' },
    ],
    constraints: ['Exploiter les propriétés mathématiques (PGCD, premiers, modulo)', 'Éviter les dépassements d\'entiers'],
  }),
  'design-studio': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} de conception (design). Implémentez une structure de données ou un système avec les opérations demandées.`,
    examples: [
      { input: 'operations = ["push(1)", "push(2)", "top()", "pop()", "empty()"]', output: '[null, null, 2, null, false]', explanation: 'Implémentation d\'une pile avec les opérations standard' },
      { input: 'operations = ["put(1,1)", "put(2,2)", "get(1)", "put(3,3)", "get(2)"]', output: '[null, null, 1, null, -1]', explanation: 'Cache LRU de capacité 2' },
    ],
    constraints: ['Toutes les opérations doivent être O(1) ou O(log n)', 'Gérer les cas limites (capacité pleine, élément absent)'],
  }),
  'concurrency-reactor': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} de concurrence et parallélisme. Gérez l'accès concurrent aux ressources partagées.`,
    examples: [
      { input: 'threads = [printA, printB, printC], order = "abc"', output: '"abc"', explanation: 'Synchroniser les threads pour imprimer dans l\'ordre' },
      { input: 'n = 5, threads = [printOdd, printEven]', output: '"12345"', explanation: 'Alterner odd/even avec des sémaphores' },
    ],
    constraints: ['Utiliser mutex, sémaphores ou barrières', 'Éviter les deadlocks', 'Garantir l\'ordre d\'exécution'],
  }),

  // PHASE 6 - Skyline
  'advanced-dp-penthouse': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} de programmation dynamique avancée. Combinez DP avec d'autres techniques (bitmask, intervalles, arbres).`,
    examples: [
      { input: 'prices = [3, 3, 5, 0, 0, 3, 1, 4]', output: '6', explanation: 'Achat/vente d\'actions avec au plus 2 transactions' },
      { input: 'stones = [2, 7, 4, 1, 8, 1]', output: '1', explanation: 'Dernière valeur minimale après fusion de pierres' },
    ],
    constraints: ['Identifier les états et transitions', 'Optimiser l\'espace mémoire', 'Complexité typique O(n²) à O(n³)'],
  }),
  'hard-graph-helipad': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les graphes avancés. Appliquez des algorithmes de graphes complexes.`,
    examples: [
      { input: 'n = 4, edges = [[0,1],[0,3],[1,2],[2,3]], conditions', output: '2', explanation: 'Coupe minimale ou flot maximal du graphe' },
      { input: 'graph avec poids négatifs', output: 'Détection de cycle négatif', explanation: 'Bellman-Ford détecte les cycles de poids négatif' },
    ],
    constraints: ['Algorithmes : Dijkstra, Bellman-Ford, Floyd-Warshall, flot maximal', 'Complexité variable selon l\'algorithme'],
  }),
  'string-algo-antenna': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} sur les algorithmes de chaînes avancés. Utilisez KMP, Rabin-Karp, ou suffix array.`,
    examples: [
      { input: 'haystack = "sadbutsad", needle = "sad"', output: '0', explanation: 'Première occurrence de "sad" à l\'indice 0 (KMP)' },
      { input: 's = "aabaaab"', output: '"aab"', explanation: 'Plus longue sous-chaîne répétée' },
    ],
    constraints: ['Complexité O(n + m) pour la recherche de motifs', 'Utiliser des algorithmes spécialisés (KMP, Z-function, suffix array)'],
  }),
  'contest-crown': (title, diff) => ({
    description: `Problème ${difficultyPrefix(diff)} de niveau compétition. Combinez plusieurs techniques algorithmiques pour résoudre ce défi.`,
    examples: [
      { input: 'Entrée complexe multi-paramètres', output: 'Solution optimale', explanation: 'Combinaison de techniques : tri + DP + structures de données' },
      { input: 'n = 10⁵, requêtes multiples', output: 'Réponses en temps linéaire', explanation: 'Pré-traitement + réponse par requête en O(1)' },
    ],
    constraints: ['Contraintes serrées nécessitant une solution optimale', 'Complexité ≤ O(n log n)', 'Attention aux constantes et aux optimisations'],
  }),
};

// Default generator for modules not explicitly covered
function defaultGenerator(title: string, difficulty: string, buildingSlug: string) {
  return {
    description: `Problème ${difficultyPrefix(difficulty)}. Analysez les entrées et produisez la sortie correcte.`,
    examples: [
      { input: 'Voir les exemples dans les tests', output: 'Résultat selon la consigne', explanation: 'Appliquez l\'algorithme approprié' },
    ],
    constraints: ['Respectez les limites de temps et de mémoire', 'Gérez les cas limites (entrées vides, valeurs extrêmes)'],
  };
}

function buildStatement(
  frenchTitle: string,
  description: string,
  examples: { input: string; output: string; explanation: string }[],
  constraints: string[],
  difficulty: string,
  buildingSlug: string
): string {
  const diffFr = DIFFICULTY_FR[difficulty] || difficulty;

  let md = `## ${frenchTitle}\n\n`;
  md += `**Difficulté** : ${diffFr.charAt(0).toUpperCase() + diffFr.slice(1)}\n\n`;
  md += `### Description\n\n`;
  md += `${description}\n\n`;

  md += `### Exemples\n\n`;
  examples.forEach((ex, i) => {
    md += `**Exemple ${i + 1} :**\n`;
    md += `- **Entrée** : \`${ex.input}\`\n`;
    md += `- **Sortie** : \`${ex.output}\`\n`;
    md += `- **Explication** : ${ex.explanation}\n\n`;
  });

  md += `### Contraintes\n\n`;
  constraints.forEach(c => {
    md += `- ${c}\n`;
  });

  return md;
}

async function updateAllStatements() {
  console.log('🚀 ALGOBOG Complete Statement Updater');
  console.log('======================================\n');
  console.log(`📚 Loaded ${Object.keys(PROBLEMS_DATA).length} known problems from JSON\n`);

  let offset = 0;
  const limit = 100;
  let totalUpdated = 0;
  let knownProblems = 0;
  let generatedProblems = 0;

  while (true) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'algo-problems',
      [Query.limit(limit), Query.offset(offset), Query.orderAsc('order')]
    );

    if (response.documents.length === 0) break;

    for (const doc of response.documents) {
      const leetcodeNumber = doc.leetcodeNumber as number;
      const leetcodeTitle = doc.leetcodeTitle as string || doc.title as string;
      const buildingSlug = doc.buildingSlug as string;
      const difficulty = doc.difficulty as string;
      // Always translate title from English source
      const frenchTitle = translateTitle(leetcodeTitle);

      let description: string;
      let examples: { input: string; output: string; explanation: string }[];
      let constraints: string[];

      // Check if we have specific data for this problem
      const knownData = PROBLEMS_DATA[String(leetcodeNumber)];
      if (knownData) {
        description = knownData.description;
        examples = knownData.examples;
        constraints = knownData.constraints;
        knownProblems++;
      } else {
        // Use module-specific generator (pass French title, not English)
        const generator = MODULE_GENERATORS[buildingSlug];
        if (generator) {
          const generated = generator(frenchTitle, difficulty);
          description = generated.description;
          examples = generated.examples;
          constraints = generated.constraints;
        } else {
          const fallback = defaultGenerator(frenchTitle, difficulty, buildingSlug);
          description = fallback.description;
          examples = fallback.examples;
          constraints = fallback.constraints;
        }
        generatedProblems++;
      }

      const statement = buildStatement(
        frenchTitle,
        description,
        examples,
        constraints,
        difficulty,
        buildingSlug
      );

      await databases.updateDocument(
        DATABASE_ID,
        'algo-problems',
        doc.$id,
        { statement, title: frenchTitle }
      );

      totalUpdated++;

      if (totalUpdated % 100 === 0) {
        console.log(`   Processed: ${totalUpdated} (${knownProblems} known, ${generatedProblems} generated)`);
      }
    }

    offset += limit;

    if (response.documents.length < limit) break;
  }

  console.log(`\n✅ Updated ${totalUpdated} problems`);
  console.log(`   📖 ${knownProblems} with exact examples from data file`);
  console.log(`   🔧 ${generatedProblems} with module-based examples`);
}

updateAllStatements().catch(console.error);
