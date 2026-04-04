/**
 * fix-arena-testcode.ts
 *
 * Corrige le testCode des 15 exercices itmade-arena (LeetCode Easy).
 *
 * Problèmes dans le testCode actuel :
 *  1. La solution est implémentée dans testCode → redéclare la fonction
 *     du user et écrase son code (le user "passe" toujours)
 *  2. Les marqueurs utilisés sont ✅/❌ (emojis composites) que
 *     parseTestOutput() ne détecte pas (il cherche ✓ / ✗)
 *
 * Fix : testCode = helpers utilitaires + runTests() uniquement,
 * avec console.log(`✓ ...`) / console.log(`✗ ...`)
 * et un compteur passed/failed final.
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);
const db = new Databases(client);
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Helper de test standard
const TEST_HEADER = `let passed = 0; let failed = 0;
function check(condition, label) {
    if (condition) { console.log('✓ ' + label); passed++; }
    else { console.error('✗ ' + label); failed++; }
}
`;

const TEST_FOOTER = `
console.log('\\nResults: ' + passed + ' passed, ' + failed + ' failed');`;

// ---------------------------------------------------------------------------
// TestCode pour chaque exercice
// ---------------------------------------------------------------------------
const exercises: Record<string, string> = {

'itmade-arena-01-two-sum': TEST_HEADER + `
// Tests — twoSum(nums, target) doit retourner les indices des 2 nombres
const tests = [
    { nums: [2,7,11,15], target: 9,  desc: 'Cas basique [2,7,11,15] target=9' },
    { nums: [3,2,4],     target: 6,  desc: 'Paire non consécutive [3,2,4] target=6' },
    { nums: [3,3],       target: 6,  desc: 'Doublons [3,3] target=6' },
    { nums: [-1,-2,-3,-4,-5], target: -8, desc: 'Nombres négatifs target=-8' },
    { nums: [0,4,3,0],   target: 0,  desc: 'Target=0' },
];
for (const t of tests) {
    const r = twoSum(t.nums, t.target);
    const ok = Array.isArray(r) && r.length === 2 &&
               t.nums[r[0]] + t.nums[r[1]] === t.target &&
               r[0] !== r[1];
    check(ok, t.desc + ' -> [' + r + ']');
}
` + TEST_FOOTER,

'itmade-arena-02-valid-parentheses': TEST_HEADER + `
// Tests — isValid(s) retourne true si les parenthèses sont valides
const tests = [
    { s: '()',     expected: true,  desc: 'Simple paire ()' },
    { s: '()[]{}',expected: true,  desc: 'Trois types consécutifs ()[]{}' },
    { s: '(]',    expected: false, desc: 'Mauvaise paire (]' },
    { s: '([)]',  expected: false, desc: 'Croisement invalide ([)]' },
    { s: '{[()]}',expected: true,  desc: 'Imbrication correcte {[()]}' },
    { s: '',      expected: true,  desc: 'String vide' },
    { s: '(((',   expected: false, desc: 'Uniquement ouvrantes (((' },
    { s: ')))',    expected: false, desc: 'Uniquement fermantes )))' },
    { s: '(())',  expected: true,  desc: 'Imbrication simple (())' },
];
for (const t of tests) {
    check(isValid(t.s) === t.expected, t.desc);
}
` + TEST_FOOTER,

'itmade-arena-03-merge-two-sorted-lists': TEST_HEADER + `
// Helper — ListNode class et utilitaires
class ListNode { constructor(val=0,next=null){this.val=val;this.next=next;} }
function arrayToList(arr) {
    if (!arr.length) return null;
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}
function listToArray(head) {
    const r = []; let cur = head;
    while (cur) { r.push(cur.val); cur = cur.next; }
    return r;
}
// Tests — mergeTwoLists(l1, l2) retourne la liste fusionnée triée
const tests = [
    { l1:[1,2,4], l2:[1,3,4], expected:[1,1,2,3,4,4], desc:'Deux listes normales' },
    { l1:[],      l2:[],      expected:[],             desc:'Deux listes vides' },
    { l1:[],      l2:[0],     expected:[0],            desc:'Une liste vide' },
    { l1:[1,2,3], l2:[4,5,6], expected:[1,2,3,4,5,6], desc:'Aucun entrelacement' },
    { l1:[5],     l2:[1,2,4], expected:[1,2,4,5],      desc:'Premier elem plus grand' },
];
for (const t of tests) {
    const r = listToArray(mergeTwoLists(arrayToList(t.l1), arrayToList(t.l2)));
    check(JSON.stringify(r) === JSON.stringify(t.expected),
          t.desc + ' -> [' + r + ']');
}
` + TEST_FOOTER,

'itmade-arena-04-best-time-stock': TEST_HEADER + `
// Tests — maxProfit(prices) retourne le profit maximum
const tests = [
    { prices:[7,1,5,3,6,4], expected:5, desc:'Acheter à 1 vendre à 6' },
    { prices:[7,6,4,3,1],   expected:0, desc:'Prix décroissant (0 profit)' },
    { prices:[1,2,3,4,5],   expected:4, desc:'Prix croissant' },
    { prices:[2,4,1],       expected:2, desc:'Max profit au début' },
    { prices:[3,2,6,5,0,3], expected:4, desc:'Acheter à 2 vendre à 6' },
    { prices:[1],            expected:0, desc:'Un seul jour' },
];
for (const t of tests) {
    check(maxProfit(t.prices) === t.expected, t.desc + ' -> ' + maxProfit(t.prices));
}
` + TEST_FOOTER,

'itmade-arena-05-valid-palindrome': TEST_HEADER + `
// Tests — isPalindrome(s) retourne true si palindrome (alphanum only, insensitive)
const tests = [
    { s:'A man, a plan, a canal: Panama', expected:true,  desc:'Palindrome classique' },
    { s:'race a car',                     expected:false, desc:'Non palindrome' },
    { s:' ',                              expected:true,  desc:'Espace seul' },
    { s:'a',                              expected:true,  desc:'Un seul caractère' },
    { s:'ab',                             expected:false, desc:'Deux caractères différents' },
    { s:'aa',                             expected:true,  desc:'Deux caractères identiques' },
    { s:'0P',                             expected:false, desc:'Chiffre et lettre' },
    { s:'Madam',                          expected:true,  desc:'Casse mixte' },
    { s:'.,',                             expected:true,  desc:'Uniquement ponctuation' },
];
for (const t of tests) {
    check(isPalindrome(t.s) === t.expected, t.desc);
}
` + TEST_FOOTER,

'itmade-arena-06-invert-binary-tree': TEST_HEADER + `
// Helper
class TreeNode { constructor(val=0,left=null,right=null){this.val=val;this.left=left;this.right=right;} }
function arrayToTree(arr) {
    if (!arr.length || arr[0]===null) return null;
    const root = new TreeNode(arr[0]);
    const q = [root]; let i = 1;
    while (q.length && i < arr.length) {
        const n = q.shift();
        if (i < arr.length && arr[i]!==null) { n.left=new TreeNode(arr[i]); q.push(n.left); } i++;
        if (i < arr.length && arr[i]!==null) { n.right=new TreeNode(arr[i]); q.push(n.right); } i++;
    }
    return root;
}
function treeToArray(root) {
    if (!root) return [];
    const r=[], q=[root];
    while (q.length) {
        const n=q.shift();
        if (!n) { r.push(null); continue; }
        r.push(n.val); q.push(n.left); q.push(n.right);
    }
    while (r[r.length-1]===null) r.pop();
    return r;
}
// Tests — invertTree(root) retourne l'arbre miroir
const tests = [
    { input:[4,2,7,1,3,6,9], expected:[4,7,2,9,6,3,1], desc:'Arbre complet' },
    { input:[2,1,3],          expected:[2,3,1],          desc:'Arbre simple' },
    { input:[],               expected:[],               desc:'Arbre vide' },
    { input:[1],              expected:[1],              desc:'Un seul noeud' },
    { input:[1,2],            expected:[1,null,2],       desc:'Enfant gauche uniquement' },
];
for (const t of tests) {
    const r = treeToArray(invertTree(arrayToTree(t.input)));
    check(JSON.stringify(r)===JSON.stringify(t.expected),
          t.desc + ' -> [' + r + ']');
}
` + TEST_FOOTER,

'itmade-arena-07-valid-anagram': TEST_HEADER + `
// Tests — isAnagram(s, t) retourne true si t est un anagramme de s
const tests = [
    { s:'anagram', t:'nagaram', expected:true,  desc:'Anagramme classique' },
    { s:'rat',     t:'car',     expected:false, desc:'Lettres différentes' },
    { s:'a',       t:'a',       expected:true,  desc:'Un seul caractère' },
    { s:'ab',      t:'ba',      expected:true,  desc:'Deux caractères inversés' },
    { s:'abc',     t:'abcd',    expected:false, desc:'Longueurs différentes' },
    { s:'aacc',    t:'ccaa',    expected:true,  desc:'Duplicatas réarrangés' },
    { s:'aabb',    t:'abab',    expected:true,  desc:'Même fréquence ordre différent' },
];
for (const t of tests) {
    check(isAnagram(t.s, t.t) === t.expected, '"' + t.s + '" / "' + t.t + '" -> ' + t.desc);
}
` + TEST_FOOTER,

'itmade-arena-08-binary-search': TEST_HEADER + `
// Tests — search(nums, target) retourne l'index ou -1
const tests = [
    { nums:[-1,0,3,5,9,12], target:9,  expected:4,  desc:'Target au milieu-droit' },
    { nums:[-1,0,3,5,9,12], target:2,  expected:-1, desc:'Target non existant' },
    { nums:[5],              target:5,  expected:0,  desc:'Un seul element (trouvé)' },
    { nums:[5],              target:3,  expected:-1, desc:'Un seul element (non trouvé)' },
    { nums:[-1,0,3,5,9,12], target:-1, expected:0,  desc:'Target au début' },
    { nums:[-1,0,3,5,9,12], target:12, expected:5,  desc:'Target à la fin' },
    { nums:[1,2,3,4,5,6,7,8,9,10], target:1,  expected:0, desc:'Premier element' },
    { nums:[1,2,3,4,5,6,7,8,9,10], target:10, expected:9, desc:'Dernier element' },
];
for (const t of tests) {
    check(search(t.nums, t.target) === t.expected,
          'search([...], ' + t.target + ') -> ' + t.desc);
}
` + TEST_FOOTER,

'itmade-arena-09-flood-fill': TEST_HEADER + `
// Tests — floodFill(image, sr, sc, color)
const tests = [
    {
        image:[[1,1,1],[1,1,0],[1,0,1]], sr:1,sc:1,color:2,
        expected:[[2,2,2],[2,2,0],[2,0,1]], desc:'Cas classique'
    },
    {
        image:[[0,0,0],[0,0,0]], sr:0,sc:0,color:0,
        expected:[[0,0,0],[0,0,0]], desc:'Couleur déjà correcte'
    },
    {
        image:[[0]], sr:0,sc:0,color:2,
        expected:[[2]], desc:'Grille 1x1'
    },
    {
        image:[[1,1,1],[1,1,1],[1,1,1]], sr:1,sc:1,color:2,
        expected:[[2,2,2],[2,2,2],[2,2,2]], desc:'Toute la grille'
    },
];
for (const t of tests) {
    // deep-copy image pour éviter mutation entre tests
    const img = t.image.map(r => [...r]);
    const r = floodFill(img, t.sr, t.sc, t.color);
    check(JSON.stringify(r)===JSON.stringify(t.expected), t.desc);
}
` + TEST_FOOTER,

'itmade-arena-10-lca-bst': TEST_HEADER + `
// Helper
class TreeNode { constructor(val=0,left=null,right=null){this.val=val;this.left=left;this.right=right;} }
function arrayToBST(arr) {
    if (!arr.length||arr[0]===null) return null;
    const root=new TreeNode(arr[0]), q=[root]; let i=1;
    while (q.length&&i<arr.length) {
        const n=q.shift();
        if (i<arr.length&&arr[i]!==null){n.left=new TreeNode(arr[i]);q.push(n.left);}i++;
        if (i<arr.length&&arr[i]!==null){n.right=new TreeNode(arr[i]);q.push(n.right);}i++;
    }
    return root;
}
function findNode(root,val){
    if(!root)return null;if(root.val===val)return root;
    return findNode(root.left,val)||findNode(root.right,val);
}
// Tests — lowestCommonAncestor(root, p, q) retourne le nœud LCA
const tree=[6,2,8,0,4,7,9,null,null,3,5];
const tests=[
    {p:2,q:8,expected:6,desc:'LCA de deux nœuds dans sous-arbres différents'},
    {p:2,q:4,expected:2,desc:'Un nœud est ancêtre de l\'autre'},
    {p:3,q:5,expected:4,desc:'Deux feuilles avec LCA intermédiaire'},
    {p:0,q:9,expected:6,desc:'Feuilles extrêmes gauche et droite'},
];
for (const t of tests) {
    const root=arrayToBST(tree);
    const r=lowestCommonAncestor(root,findNode(root,t.p),findNode(root,t.q));
    check(r&&r.val===t.expected, 'LCA('+t.p+','+t.q+')='+t.expected+' — '+t.desc);
}
// Test arbre simple
const t2=[2,1]; const r2=arrayToBST(t2);
const lca2=lowestCommonAncestor(r2,findNode(r2,2),findNode(r2,1));
check(lca2&&lca2.val===2, 'LCA(2,1)=2 dans arbre [2,1]');
` + TEST_FOOTER,

'itmade-arena-11-balanced-tree': TEST_HEADER + `
// Helper
class TreeNode { constructor(val=0,left=null,right=null){this.val=val;this.left=left;this.right=right;} }
function arrayToTree(arr) {
    if (!arr.length||arr[0]===null) return null;
    const root=new TreeNode(arr[0]),q=[root];let i=1;
    while(q.length&&i<arr.length){
        const n=q.shift();
        if(i<arr.length&&arr[i]!==null){n.left=new TreeNode(arr[i]);q.push(n.left);}i++;
        if(i<arr.length&&arr[i]!==null){n.right=new TreeNode(arr[i]);q.push(n.right);}i++;
    }
    return root;
}
// Tests — isBalanced(root) retourne true si l'arbre est équilibré
const tests=[
    {tree:[3,9,20,null,null,15,7],expected:true, desc:'Arbre balancé simple'},
    {tree:[1,2,2,3,3,null,null,4,4],expected:false,desc:'Arbre débalancé'},
    {tree:[],expected:true, desc:'Arbre vide'},
    {tree:[1],expected:true, desc:'Un seul nœud'},
    {tree:[1,2,3],expected:true, desc:'Arbre complet niveau 2'},
    {tree:[1,2,null,3],expected:false,desc:'Chaîne à gauche'},
    {tree:[1,null,2,null,3],expected:false,desc:'Chaîne à droite'},
];
for (const t of tests) {
    check(isBalanced(arrayToTree(t.tree))===t.expected, t.desc);
}
` + TEST_FOOTER,

'itmade-arena-12-linked-list-cycle': TEST_HEADER + `
// Helper
class ListNode { constructor(val=0,next=null){this.val=val;this.next=next;} }
function createCycleList(values,pos) {
    if(!values.length) return null;
    const head=new ListNode(values[0]);
    let cur=head, cycleNode=null;
    for(let i=1;i<values.length;i++){
        cur.next=new ListNode(values[i]); cur=cur.next;
        if(i===pos) cycleNode=cur;
    }
    if(pos===0) cur.next=head;
    else if(pos>0&&cycleNode) cur.next=cycleNode;
    return head;
}
// Tests — hasCycle(head) retourne true si cycle
const tests=[
    {values:[3,2,0,-4],pos:1,expected:true, desc:'Cycle au milieu (pos=1)'},
    {values:[1,2],pos:0,expected:true,       desc:'Cycle au début (pos=0)'},
    {values:[1],pos:-1,expected:false,       desc:'Un seul nœud sans cycle'},
    {values:[1,2,3,4,5],pos:-1,expected:false,desc:'Liste normale sans cycle'},
    {values:[],pos:-1,expected:false,        desc:'Liste vide'},
    {values:[1,2,3,4,5],pos:4,expected:true, desc:'Self-loop à la fin'},
];
for (const t of tests) {
    check(hasCycle(createCycleList(t.values,t.pos))===t.expected, t.desc);
}
` + TEST_FOOTER,

'itmade-arena-13-queue-using-stacks': TEST_HEADER + `
// Tests — MyQueue avec push/pop/peek/empty
// Test 1 : opérations de base
let q = new MyQueue();
q.push(1); q.push(2);
check(q.peek()===1, 'peek() après push(1),push(2) -> 1');
check(q.pop()===1,  'pop()  après push(1),push(2) -> 1 (FIFO)');
check(q.empty()===false, 'empty() après 1 pop sur 2 éléments -> false');

// Test 2 : séquence alternée
q = new MyQueue();
q.push(1); q.push(2); q.push(3);
check(q.pop()===1, 'pop() séquence 1,2,3 -> 1');
q.push(4);
check(q.pop()===2, 'pop() après push(4) -> 2');
check(q.peek()===3,'peek() -> 3');

// Test 3 : vider complètement
q = new MyQueue();
q.push(1); q.push(2); q.pop(); q.pop();
check(q.empty()===true, 'empty() après pop de tous les éléments -> true');

// Test 4 : FIFO ordre
q = new MyQueue();
for(let i=1;i<=5;i++) q.push(i);
let fifoOk=true;
for(let i=1;i<=5;i++) if(q.pop()!==i) fifoOk=false;
check(fifoOk, 'FIFO: push(1..5) puis pop() renvoie 1,2,3,4,5 dans l\'ordre');
` + TEST_FOOTER,

'itmade-arena-14-first-bad-version': TEST_HEADER + `
// Tests — solution(isBadVersion)(n) retourne la première version bad
const tests=[
    {n:5,   bad:4, desc:'Cas classique n=5 bad=4'},
    {n:1,   bad:1, desc:'Une seule version (bad)'},
    {n:10,  bad:1, desc:'Première version est bad'},
    {n:10,  bad:10,desc:'Dernière version est bad'},
    {n:100, bad:50,desc:'Bad au milieu exact'},
    {n:2126753390,bad:1702766719,desc:'Très grand n (overflow check)'},
];
for (const t of tests) {
    const isBadVersion = v => v >= t.bad;
    const firstBad = solution(isBadVersion);
    check(firstBad(t.n)===t.bad, t.desc + ' -> ' + firstBad(t.n));
}
` + TEST_FOOTER,

'itmade-arena-15-ransom-note': TEST_HEADER + `
// Tests — canConstruct(ransomNote, magazine) retourne true si possible
const tests=[
    {note:'a',     mag:'b',     expected:false, desc:'Lettre non disponible'},
    {note:'aa',    mag:'ab',    expected:false, desc:'Pas assez de lettres'},
    {note:'aa',    mag:'aab',   expected:true,  desc:'Exactement assez'},
    {note:'a',     mag:'a',     expected:true,  desc:'Cas simple (égaux)'},
    {note:'',      mag:'abc',   expected:true,  desc:'Ransom note vide'},
    {note:'abc',   mag:'aabbcc',expected:true,  desc:'Lettres avec surplus'},
    {note:'abc',   mag:'ab',    expected:false, desc:'Magazine trop court'},
    {note:'aabbcc',mag:'abcabc',expected:true,  desc:'Lettres exactement suffisantes'},
];
for (const t of tests) {
    check(canConstruct(t.note,t.mag)===t.expected,
          '"'+t.note+'" dans "'+t.mag+'" -> '+t.desc);
}
` + TEST_FOOTER,

};

// ---------------------------------------------------------------------------
// Push vers Appwrite
// ---------------------------------------------------------------------------
async function main() {
    console.log('\n🔧 Fix testCode — 15 exercices itmade-arena\n');

    for (const [slug, testCode] of Object.entries(exercises)) {
        const r = await db.listDocuments(DB, 'js-levels', [
            Query.equal('slug', slug), Query.limit(1)
        ]);
        if (!r.documents.length) { console.log(`  ⚠️  ${slug}: introuvable`); continue; }

        await db.updateDocument(DB, 'js-levels', r.documents[0].$id, { testCode });
        console.log(`  ✅ ${slug} (${testCode.length} chars)`);
    }

    console.log('\n✨ Terminé !\n');
}

main().catch(err => { console.error('Erreur:', err); process.exit(1); });
