/**
 * fix-cbog-statements.ts
 *
 * Corrige les statements incomplets/vides pour 17 exercices CBOG.
 * Critères d'un bon statement :
 *  - Objectif clair (ce que l'utilisateur doit implémenter)
 *  - Prototype C avec types
 *  - Exemples d'entrée/sortie
 *  - Contraintes et notes importantes
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

const statements: Record<string, string> = {

ft_sqrt: `## Objectif

Implémenter \`ft_sqrt\` qui retourne la **racine carrée entière** d'un nombre, ou \`0\` si le nombre n'a pas de racine carrée entière exacte.

## Prototype

\`\`\`c
int ft_sqrt(int nb);
\`\`\`

## Exemples

\`\`\`
ft_sqrt(16)  → 4   (car 4 × 4 = 16)
ft_sqrt(25)  → 5   (car 5 × 5 = 25)
ft_sqrt(17)  → 0   (pas de racine entière)
ft_sqrt(1)   → 1
ft_sqrt(0)   → 0
ft_sqrt(-4)  → 0   (négatif → 0)
\`\`\`

## Contraintes

- Si \`nb < 0\`, retourner \`0\`
- Si \`nb == 0\`, retourner \`0\`
- Chercher un entier \`i\` tel que \`i * i == nb\` — si introuvable, retourner \`0\`
- Complexité cible : O(√n) avec une simple boucle

## Astuce

\`\`\`c
int i = 1;
while (i * i < nb)
    i++;
if (i * i == nb)
    return (i);
return (0);
\`\`\``,

ft_swap: `## Objectif

Implémenter \`ft_swap\` qui **échange les valeurs** de deux variables entières via leurs pointeurs. La modification doit être visible dans les variables originales (passage par référence avec pointeurs).

## Prototype

\`\`\`c
void ft_swap(int *a, int *b);
\`\`\`

## Exemples

\`\`\`
int x = 5, y = 10;
ft_swap(&x, &y);
// x == 10, y == 5

int a = -3, b = 42;
ft_swap(&a, &b);
// a == 42, b == -3
\`\`\`

## Contraintes

- Utiliser une variable temporaire \`tmp\`
- Les pointeurs ne sont jamais NULL dans les tests

## Astuce — XOR swap (sans variable temporaire)

\`\`\`c
*a ^= *b;
*b ^= *a;
*a ^= *b;
\`\`\`

> ⚠️ Le XOR swap ne fonctionne PAS si \`a == b\` (même adresse).`,

ft_sort_int_tab: `## Objectif

Implémenter \`ft_sort_int_tab\` qui trie un tableau d'entiers par **ordre croissant** en place (modifie le tableau original).

## Prototype

\`\`\`c
void ft_sort_int_tab(int *tab, int size);
\`\`\`

## Exemples

\`\`\`
int arr[] = {5, 3, 8, 1, 9, 2};
ft_sort_int_tab(arr, 6);
// arr == [1, 2, 3, 5, 8, 9]

int arr2[] = {-5, 0, -1, 3};
ft_sort_int_tab(arr2, 4);
// arr2 == [-5, -1, 0, 3]
\`\`\`

## Contraintes

- Algorithme de tri à bulles (Bubble Sort) recommandé
- Trier en place — ne pas allouer de tableau temporaire
- Si \`size <= 1\`, ne rien faire

## Rappel — Bubble Sort

\`\`\`c
// Comparer chaque paire adjacente et échanger si nécessaire
// Répéter jusqu'à ce que le tableau soit trié
// Complexité : O(n²)
\`\`\``,

ft_rev_int_tab: `## Objectif

Implémenter \`ft_rev_int_tab\` qui **inverse l'ordre** des éléments d'un tableau d'entiers en place.

## Prototype

\`\`\`c
void ft_rev_int_tab(int *tab, int size);
\`\`\`

## Exemples

\`\`\`
int arr[] = {1, 2, 3, 4, 5};
ft_rev_int_tab(arr, 5);
// arr == [5, 4, 3, 2, 1]

int arr2[] = {10, 20};
ft_rev_int_tab(arr2, 2);
// arr2 == [20, 10]

int arr3[] = {42};
ft_rev_int_tab(arr3, 1);
// arr3 == [42] (inchangé)
\`\`\`

## Contraintes

- Modification en place avec la technique **Two Pointers** (deux indices convergents)
- Complexité : O(n/2) = O(n), espace O(1)
- Si \`size <= 1\`, ne rien faire

## Algorithme Two Pointers

\`\`\`c
int left = 0;
int right = size - 1;
while (left < right) {
    // Échanger tab[left] et tab[right]
    // Avancer les deux pointeurs
}
\`\`\``,

ft_list_remove_if: `## Objectif

Implémenter \`ft_list_remove_if\` qui **supprime tous les maillons** d'une liste chaînée dont la donnée correspond à \`data_ref\` selon la fonction de comparaison \`cmp\`.

## Prototype

\`\`\`c
typedef struct s_list {
    void         *data;
    struct s_list *next;
} t_list;

void ft_list_remove_if(t_list **begin_list, void *data_ref,
                       int (*cmp)(), void (*free_fct)(void *));
\`\`\`

## Paramètres

- \`begin_list\` : pointeur vers le premier maillon (modifié si la tête est supprimée)
- \`data_ref\` : valeur de référence à chercher
- \`cmp(a, b)\` : retourne \`0\` si \`a == b\` (même convention que \`strcmp\`)
- \`free_fct\` : appelée sur \`data\` de chaque maillon supprimé (peut être \`NULL\`)

## Exemples

\`\`\`
Liste : [5 → 10 → 5 → 20 → 5 → 30]
ft_list_remove_if(&list, &(int){5}, int_cmp, NULL);
Résultat : [10 → 20 → 30]

Liste : [1 → 2 → 3]
ft_list_remove_if(&list, &(int){1}, int_cmp, NULL);
Résultat : [2 → 3]   // suppression de la tête
\`\`\`

## Points d'attention

- Gérer la suppression **en tête** : mettre à jour \`*begin_list\`
- Gérer la suppression **au milieu et en queue** : relier le maillon précédent au suivant
- Libérer chaque maillon supprimé avec \`free()\``,

ft_list_sort: `## Objectif

Implémenter \`ft_list_sort\` qui **trie une liste chaînée** en utilisant une fonction de comparaison générique.

## Prototype

\`\`\`c
typedef struct s_list {
    void         *data;
    struct s_list *next;
} t_list;

void ft_list_sort(t_list **begin_list, int (*cmp)());
\`\`\`

## Paramètres

- \`begin_list\` : pointeur vers le premier maillon
- \`cmp(a, b)\` : retourne \`< 0\` si a avant b, \`> 0\` si b avant a, \`0\` si égaux (comme \`strcmp\`)

## Exemples

\`\`\`
// Tri d'entiers avec int_cmp (retourne *a - *b)
Liste : [42 → 5 → 18 → 99 → 3]
Après tri : [3 → 5 → 18 → 42 → 99]

// Tri de chaînes avec str_cmp (strcmp)
Liste : ["Zebra" → "Alice" → "Bob"]
Après tri : ["Alice" → "Bob" → "Zebra"]
\`\`\`

## Contraintes

- Algorithme au choix (tri par sélection, bubble sort sur données...)
- Ne pas allouer de nouveaux maillons — échanger les \`data\`
- Si la liste est vide ou a un seul élément, ne rien faire
- Complexité cible : O(n²) acceptable`,

ft_iterative_power: `## Objectif

Implémenter \`ft_iterative_power\` qui calcule **nb élevé à la puissance power** de façon itérative (sans récursion).

## Prototype

\`\`\`c
int ft_iterative_power(int nb, int power);
\`\`\`

## Exemples

\`\`\`
ft_iterative_power(2, 3)   → 8    (2 × 2 × 2)
ft_iterative_power(5, 0)   → 1    (tout nombre^0 = 1)
ft_iterative_power(0, 0)   → 1    (convention : 0^0 = 1)
ft_iterative_power(2, 10)  → 1024
ft_iterative_power(3, -2)  → 0    (exposant négatif → 0)
ft_iterative_power(0, 5)   → 0
\`\`\`

## Contraintes

- Si \`power < 0\`, retourner \`0\`
- Si \`power == 0\`, retourner \`1\` (quelle que soit la base)
- Utiliser une boucle (pas de récursion)

## Algorithme

\`\`\`c
int result = 1;
while (power > 0) {
    result *= nb;
    power--;
}
return (result);
\`\`\``,

ft_is_prime: `## Objectif

Implémenter \`ft_is_prime\` qui retourne \`1\` si un nombre est **premier**, \`0\` sinon.

Un nombre premier est un entier > 1 qui n'est divisible que par 1 et lui-même.

## Prototype

\`\`\`c
int ft_is_prime(int nb);
\`\`\`

## Exemples

\`\`\`
ft_is_prime(2)  → 1   (premier nombre premier)
ft_is_prime(3)  → 1
ft_is_prime(4)  → 0   (divisible par 2)
ft_is_prime(7)  → 1
ft_is_prime(97) → 1
ft_is_prime(1)  → 0   (1 n'est pas premier par convention)
ft_is_prime(0)  → 0
ft_is_prime(-5) → 0
\`\`\`

## Algorithme optimisé

\`\`\`c
// Tester les diviseurs de 2 jusqu'à √nb
// Si nb % i == 0 pour un i dans cet intervalle → pas premier
// Complexité : O(√n)
if (nb < 2) return 0;
int i = 2;
while (i * i <= nb) {
    if (nb % i == 0) return 0;
    i++;
}
return 1;
\`\`\``,

ft_realloc_safe: `## Objectif

Implémenter \`ft_realloc_safe\`, un **wrapper sécurisé pour \`realloc\`** qui évite la fuite mémoire en cas d'échec.

## Le problème avec \`realloc\` standard

\`\`\`c
// ❌ DANGEREUX — si realloc échoue, ptr devient NULL
// et on perd la référence au bloc original
ptr = realloc(ptr, new_size);
\`\`\`

Si \`realloc\` échoue, il retourne \`NULL\` mais **ne libère pas** le bloc original. En écrasant \`ptr\`, on perd l'adresse du bloc → fuite mémoire garantie.

## Prototype

\`\`\`c
void *ft_realloc_safe(void **ptr, size_t new_size);
\`\`\`

## Comportement attendu

- Si \`realloc\` réussit : mettre à jour \`*ptr\` et retourner le nouveau pointeur
- Si \`realloc\` échoue : **garder \`*ptr\` inchangé**, retourner \`NULL\`
- Si \`*ptr == NULL\` : se comporte comme \`malloc(new_size)\`
- Si \`new_size == 0\` : libère la mémoire, met \`*ptr = NULL\`, retourne \`NULL\`

## Exemple d'utilisation

\`\`\`c
int *arr = malloc(sizeof(int) * 5);
// ... remplir arr ...

// ✅ SÉCURISÉ
if (!ft_realloc_safe((void **)&arr, sizeof(int) * 10)) {
    // arr pointe toujours sur l'ancien bloc valide
    // on peut continuer à l'utiliser ou le libérer proprement
    printf("realloc échoué, ancien bloc préservé\\n");
}
\`\`\``,

ft_btree: `## Objectif

Implémenter les fonctions d'un **arbre binaire de recherche (BST)** : insertion, parcours, et libération de mémoire.

## Structure

\`\`\`c
typedef struct s_btree {
    int             value;
    struct s_btree *left;
    struct s_btree *right;
} t_btree;
\`\`\`

## Fonctions à implémenter

\`\`\`c
// Créer un nouveau nœud
t_btree *create_node(int value);

// Insérer une valeur dans le BST
// Valeurs < root → sous-arbre gauche
// Valeurs >= root → sous-arbre droit
void insert_node(t_btree **root, int value);

// Parcours in-order (affiche les valeurs triées)
void print_inorder(t_btree *root);

// Libérer tous les nœuds
void free_tree(t_btree *root);
\`\`\`

## Exemples

\`\`\`
Insertion de : 5, 3, 7, 1, 4
         5
        / \\
       3   7
      / \\
     1   4

print_inorder → 1 3 4 5 7   (ordre croissant)
\`\`\`

## Propriété BST

Pour chaque nœud \`n\` :
- Tous les nœuds du **sous-arbre gauche** ont une valeur **< n->value**
- Tous les nœuds du **sous-arbre droit** ont une valeur **>= n->value**`,

ft_graph: `## Objectif

Implémenter un **graphe non orienté** représenté par une **liste d'adjacence**. Implémenter la création du graphe, l'ajout d'arêtes, et les traversées BFS/DFS.

## Structures

\`\`\`c
#define MAX_VERTICES 10

typedef struct s_node {
    int             vertex;
    struct s_node  *next;
} t_node;

typedef struct s_graph {
    t_node *adj_list[MAX_VERTICES];
    int     num_vertices;
} t_graph;
\`\`\`

## Fonctions à implémenter

\`\`\`c
// Créer un graphe de n sommets
t_graph *create_graph(int vertices);

// Ajouter une arête non orientée entre src et dest
void add_edge(t_graph *graph, int src, int dest);

// Afficher le graphe (liste d'adjacence)
void print_graph(t_graph *graph);

// Parcours BFS depuis un sommet source
void bfs(t_graph *graph, int start);

// Parcours DFS depuis un sommet source
void dfs(t_graph *graph, int start, int *visited);
\`\`\`

## Exemple

\`\`\`
Graphe : 0-1, 0-2, 1-3, 2-3
Liste d'adjacence :
  0 → [1, 2]
  1 → [0, 3]
  2 → [0, 3]
  3 → [1, 2]

BFS depuis 0 : 0 1 2 3
DFS depuis 0 : 0 1 3 2
\`\`\``,

ft_csv_parser: `## Objectif

Implémenter \`parse_csv_line\` qui **parse une ligne CSV** (valeurs séparées par des virgules) et retourne un tableau de chaînes de caractères.

## Prototype

\`\`\`c
// Retourne un tableau de chaînes terminé par NULL
// Chaque champ est alloué dynamiquement (strdup)
char **parse_csv_line(char *line);

// Libérer le tableau retourné
void free_fields(char **fields);
\`\`\`

## Exemples

\`\`\`
parse_csv_line("John,Doe,30,Engineer")
→ ["John", "Doe", "30", "Engineer", NULL]

parse_csv_line("Alice,Smith,25,Designer")
→ ["Alice", "Smith", "25", "Designer", NULL]

parse_csv_line("single")
→ ["single", NULL]
\`\`\`

## Contraintes

- Utiliser \`strtok\` ou parcourir la chaîne manuellement
- Chaque champ doit être une copie indépendante (utiliser \`strdup\`)
- Le tableau doit être terminé par \`NULL\`
- La fonction \`free_fields\` libère chaque champ + le tableau lui-même

## Astuce avec strtok

\`\`\`c
char *token = strtok(line, ",");
while (token) {
    fields[i++] = strdup(token);
    token = strtok(NULL, ",");
}
fields[i] = NULL;
\`\`\``,

ft_json_simple: `## Objectif

Implémenter un **parser JSON simplifié** capable d'extraire les paires clé/valeur d'un objet JSON à un niveau de profondeur (pas de nesting).

## Structure

\`\`\`c
typedef struct s_json_field {
    char *key;
    char *value;
} t_json_field;
\`\`\`

## Prototype

\`\`\`c
// Parser un champ JSON de la forme : "clé": "valeur"
t_json_field *parse_json_field(char *str);

// Afficher un champ
void print_json_field(t_json_field *field);

// Libérer un champ
void free_field(t_json_field *field);
\`\`\`

## Exemples

\`\`\`
parse_json_field("  \\"name\\": \\"Alice\\"")
→ key="name", value="Alice"

parse_json_field("  \\"age\\": \\"30\\"")
→ key="age", value="30"
\`\`\`

## Format attendu

Les chaînes d'entrée suivent le format JSON standard :
\`\`\`
  "clé": "valeur"
\`\`\`
- Les guillemets encadrent la clé et la valeur
- Un espace sépare \`:\` de la valeur
- Pas de nesting, pas de tableaux`,

executor: `## Objectif

Implémenter les fonctions d'**exécution de commandes** d'un minishell : dispatcher entre commandes built-in et commandes externes, et exécuter les commandes externes via \`fork\` + \`execve\`.

## Structures et prototypes

\`\`\`c
typedef struct s_cmd {
    char  *name;   // Nom de la commande, ex: "echo"
    char **args;   // argv complet, ex: {"echo", "hello", NULL}
} t_cmd;

// Dispatcher : built-in ou externe ?
int execute_command(t_cmd *cmd, char **env);

// Exécuter une commande externe via fork + execve
// Chercher dans /bin puis /usr/bin si chemin non absolu
int execute_external(t_cmd *cmd, char **env);
\`\`\`

## Comportement

\`\`\`
execute_command({"ls", {"-l", NULL}}, env)
→ appelle execute_external si "ls" n'est pas built-in
→ fork() → execve("/bin/ls", {"-l", NULL}, env) dans le fils
→ waitpid() dans le parent, retourne le code de sortie

execute_command({"exit", {NULL}}, env)
→ appelle execute_builtin si "exit" est built-in
\`\`\`

## Points d'attention

- \`fork()\` retourne \`0\` dans le fils, \`pid\` dans le parent
- Utiliser \`WEXITSTATUS(status)\` pour récupérer le code de sortie
- Chercher la commande dans \`/bin/\` et \`/usr/bin/\` si le chemin n'est pas absolu
- Si la commande est introuvable : afficher une erreur et retourner \`127\``,

ft_file_search: `## Objectif

Implémenter \`ft_file_search\` qui **lit un fichier ligne par ligne** et affiche chaque ligne contenant le pattern recherché, précédée de son numéro de ligne.

## Prototype

\`\`\`c
void ft_file_search(const char *filename, const char *pattern);
\`\`\`

## Format de sortie

\`\`\`
numéro_de_ligne: contenu de la ligne
\`\`\`

## Exemple

\`\`\`
Fichier "test.txt" :
    1: bonjour monde
    2: hello world
    3: foo bar baz
    4: hello again

ft_file_search("test.txt", "hello")
→ 2: hello world
→ 4: hello again
\`\`\`

## Contraintes

- Utiliser \`fopen\` / \`fgets\` / \`fclose\`
- Utiliser \`strstr\` pour détecter le pattern dans chaque ligne
- Si le fichier ne peut pas être ouvert, afficher une erreur avec \`perror\`
- Les numéros de ligne commencent à \`1\`

## Algorithme

\`\`\`c
FILE *file = fopen(filename, "r");
char line[1024];
int line_num = 1;
while (fgets(line, sizeof(line), file)) {
    if (strstr(line, pattern))
        printf("%d: %s", line_num, line);
    line_num++;
}
fclose(file);
\`\`\``,

ft_hexdump: `## Objectif

Implémenter \`ft_hexdump\` qui affiche le contenu d'un fichier au **format hexadécimal**, similaire à la commande Unix \`xxd\` ou \`hexdump -C\`.

## Prototype

\`\`\`c
void ft_hexdump(const char *filename);
\`\`\`

## Format de sortie (16 octets par ligne)

\`\`\`
offset    octets hex (8+8)         |ASCII|
00000000  48 65 6c 6c 6f 2c 20 57  6f 72 6c 64 21 0a      |Hello, World!.|
\`\`\`

- **Offset** : position en hexadécimal, 8 chiffres (ex: \`00000000\`)
- **Octets hex** : chaque octet en 2 chiffres hexa, séparés par des espaces
- **Section ASCII** : entre \`|\`...\`|\`, les caractères imprimables (32-126), sinon \`.\`
- Un espace supplémentaire après le 8ème octet (alignement)

## Contraintes

- Utiliser \`open\` / \`read\` / \`close\` (pas \`fopen\`)
- Lire par blocs de 16 octets
- Gérer la dernière ligne incomplète (< 16 octets) avec des espaces de remplissage

## Exemple

\`\`\`
Fichier contenant "Hello, World!\\n" :
00000000  48 65 6c 6c 6f 2c 20 57  6f 72 6c 64 21 0a      |Hello, World!.|
\`\`\``,

dictionary: `## Objectif

Implémenter un **dictionnaire clé/valeur** basé sur une **table de hachage** (hash table). Le dictionnaire doit supporter les opérations CRUD basiques : set, get, delete.

## Structures

\`\`\`c
typedef struct s_entry {
    char            *key;
    char            *value;
    struct s_entry  *next;  // Chaînage pour gérer les collisions
} t_entry;

typedef struct s_dict {
    t_entry **buckets;  // Tableau de listes chaînées
    size_t    size;     // Nombre de buckets
    int       count;    // Nombre d'entrées total
} t_dict;
\`\`\`

## Fonctions à implémenter

\`\`\`c
// Créer un dictionnaire avec n buckets
t_dict *dict_create(size_t size);

// Ajouter ou mettre à jour une entrée
void dict_set(t_dict *dict, const char *key, const char *value);

// Récupérer une valeur par clé (NULL si absente)
char *dict_get(t_dict *dict, const char *key);

// Supprimer une entrée
void dict_delete(t_dict *dict, const char *key);

// Libérer la mémoire
void dict_free(t_dict *dict);
\`\`\`

## Exemple

\`\`\`
dict_set(d, "name",  "Alice");
dict_set(d, "age",   "30");
dict_set(d, "city",  "Paris");

dict_get(d, "name")  → "Alice"
dict_get(d, "age")   → "30"
dict_get(d, "xyz")   → NULL

dict_delete(d, "age");
dict_get(d, "age")   → NULL
\`\`\`

## Fonction de hachage (djb2)

\`\`\`c
unsigned long hash(const char *str, size_t size) {
    unsigned long h = 5381;
    int c;
    while ((c = *str++))
        h = ((h << 5) + h) + c;  // h * 33 + c
    return (h % size);
}
\`\`\``,

};

async function main() {
    console.log('\n🔧 Fix statements — 17 exercices CBOG\n');
    let updated = 0;

    for (const [slug, statement] of Object.entries(statements)) {
        const r = await db.listDocuments(DB, 'c-exercises', [
            Query.equal('slug', slug), Query.limit(1)
        ]);
        if (!r.documents.length) { console.log(`  ⚠️  ${slug}: introuvable`); continue; }

        await db.updateDocument(DB, 'c-exercises', r.documents[0].$id, { statement });
        console.log(`  ✅ ${slug} (${statement.length} chars)`);
        updated++;
    }

    console.log(`\n✨ ${updated} statements mis à jour !\n`);
}

main().catch(err => { console.error('Erreur:', err); process.exit(1); });
