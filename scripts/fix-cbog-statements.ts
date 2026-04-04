/**
 * fix-cbog-statements.ts
 *
 * Statements 42/Épita-style pour 17 exercices CBOG.
 *
 * Convention hints cachés :
 *   <!-- HINT_START -->
 *   contenu visible uniquement en mode "facile"
 *   <!-- HINT_END -->
 *
 * Les commentaires HTML ne sont pas rendus par les parsers Markdown.
 * Quand le mode facile sera implémenté, le frontend cherchera ces
 * marqueurs et les affichera comme sections dépliables.
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
ft_sqrt(16)  → 4
ft_sqrt(25)  → 5
ft_sqrt(17)  → 0   (pas de racine entière exacte)
ft_sqrt(1)   → 1
ft_sqrt(0)   → 0
ft_sqrt(-4)  → 0
\`\`\`

## Contraintes

- Si \`nb < 0\`, retourner \`0\`
- Si \`nb == 0\`, retourner \`0\`
- Complexité cible : O(√n)

<!-- HINT_START -->
## 💡 Indice (mode facile)

Chercher un entier \`i\` tel que \`i * i == nb\`.

\`\`\`c
int i = 1;
while (i * i < nb)
    i++;
if (i * i == nb)
    return (i);
return (0);
\`\`\`
<!-- HINT_END -->`,

ft_swap: `## Objectif

Implémenter \`ft_swap\` qui **échange les valeurs** de deux variables entières via leurs pointeurs.

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

- Utiliser une variable temporaire
- Les pointeurs ne sont jamais NULL dans les tests
- La modification doit être visible dans les variables originales

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`\`\`c
int tmp = *a;
*a = *b;
*b = tmp;
\`\`\`

**Bonus :** XOR swap sans variable temporaire (ne fonctionne pas si \`a == b\` — même adresse) :
\`\`\`c
*a ^= *b; *b ^= *a; *a ^= *b;
\`\`\`
<!-- HINT_END -->`,

ft_sort_int_tab: `## Objectif

Implémenter \`ft_sort_int_tab\` qui trie un tableau d'entiers par **ordre croissant** en place.

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

- Tri en place — ne pas allouer de tableau temporaire
- Si \`size <= 1\`, ne rien faire
- Algorithme au choix

<!-- HINT_START -->
## 💡 Indice (mode facile)

Algorithme de **tri à bulles** (Bubble Sort) — O(n²) :
- Parcourir le tableau en comparant chaque paire adjacente
- Échanger si \`tab[i] > tab[i+1]\`
- Répéter jusqu'à ce que le tableau soit trié
<!-- HINT_END -->`,

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

int arr2[] = {42};
ft_rev_int_tab(arr2, 1);
// arr2 == [42]  (inchangé)
\`\`\`

## Contraintes

- Modification en place — espace O(1)
- Si \`size <= 1\`, ne rien faire

<!-- HINT_START -->
## 💡 Indice (mode facile)

Technique **Two Pointers** : un indice \`left = 0\` et un \`right = size - 1\` qui convergent vers le centre en échangeant les valeurs.
<!-- HINT_END -->`,

ft_list_remove_if: `## Objectif

Implémenter \`ft_list_remove_if\` qui **supprime tous les maillons** d'une liste chaînée dont la donnée correspond à \`data_ref\` selon la fonction \`cmp\`.

## Prototype

\`\`\`c
typedef struct s_list {
    void          *data;
    struct s_list *next;
} t_list;

void ft_list_remove_if(t_list **begin_list, void *data_ref,
                       int (*cmp)(), void (*free_fct)(void *));
\`\`\`

## Paramètres

- \`cmp(a, b)\` retourne \`0\` si égaux (convention \`strcmp\`)
- \`free_fct\` est appelée sur \`data\` avant libération (peut être \`NULL\`)

## Exemples

\`\`\`
Liste : [5 → 10 → 5 → 20 → 5 → 30]
Supprimer les 5 → [10 → 20 → 30]

Liste : [1 → 2 → 3]
Supprimer 1 (tête) → [2 → 3]
\`\`\`

## Contraintes

- Gérer la suppression **en tête** (mettre à jour \`*begin_list\`)
- Libérer chaque maillon supprimé avec \`free()\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

Deux passes :
1. Supprimer les maillons en tête tant qu'ils matchent (\`while (*begin_list && cmp(...) == 0)\`)
2. Parcourir le reste et relier \`current->next = tmp->next\` quand un maillon matche
<!-- HINT_END -->`,

ft_list_sort: `## Objectif

Implémenter \`ft_list_sort\` qui **trie une liste chaînée** en utilisant une fonction de comparaison générique.

## Prototype

\`\`\`c
typedef struct s_list {
    void          *data;
    struct s_list *next;
} t_list;

void ft_list_sort(t_list **begin_list, int (*cmp)());
\`\`\`

## Paramètres

- \`cmp(a, b)\` : \`< 0\` si a avant b, \`> 0\` si b avant a

## Exemples

\`\`\`
// int_cmp retourne *a - *b
[42 → 5 → 18 → 99 → 3]  →  [3 → 5 → 18 → 42 → 99]

// str_cmp = strcmp
["Zebra" → "Alice" → "Bob"]  →  ["Alice" → "Bob" → "Zebra"]
\`\`\`

## Contraintes

- Ne pas allouer de nouveaux maillons
- Si vide ou un seul élément, ne rien faire

<!-- HINT_START -->
## 💡 Indice (mode facile)

Approche simple : échanger les \`data\` (pas les maillons) avec un algorithme de tri à bulles sur la liste.
<!-- HINT_END -->`,

ft_iterative_power: `## Objectif

Implémenter \`ft_iterative_power\` qui calcule **nb élevé à la puissance power** de façon itérative.

## Prototype

\`\`\`c
int ft_iterative_power(int nb, int power);
\`\`\`

## Exemples

\`\`\`
ft_iterative_power(2, 3)   → 8
ft_iterative_power(5, 0)   → 1
ft_iterative_power(0, 0)   → 1   (convention)
ft_iterative_power(2, 10)  → 1024
ft_iterative_power(3, -2)  → 0   (exposant négatif)
\`\`\`

## Contraintes

- Si \`power < 0\`, retourner \`0\`
- Si \`power == 0\`, retourner \`1\` (quelle que soit la base)
- Pas de récursion

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`\`\`c
int result = 1;
while (power > 0) {
    result *= nb;
    power--;
}
return (result);
\`\`\`
<!-- HINT_END -->`,

ft_is_prime: `## Objectif

Implémenter \`ft_is_prime\` qui retourne \`1\` si un entier est **premier**, \`0\` sinon.

Un nombre premier est un entier > 1 divisible uniquement par 1 et lui-même.

## Prototype

\`\`\`c
int ft_is_prime(int nb);
\`\`\`

## Exemples

\`\`\`
ft_is_prime(2)   → 1
ft_is_prime(7)   → 1
ft_is_prime(97)  → 1
ft_is_prime(4)   → 0   (divisible par 2)
ft_is_prime(1)   → 0   (1 n'est pas premier par convention)
ft_is_prime(0)   → 0
ft_is_prime(-5)  → 0
\`\`\`

## Contraintes

- Si \`nb < 2\`, retourner \`0\`
- Complexité cible : O(√n)

<!-- HINT_START -->
## 💡 Indice (mode facile)

Tester les diviseurs de \`2\` jusqu'à \`√nb\` — si aucun ne divise \`nb\`, il est premier.

\`\`\`c
int i = 2;
while (i * i <= nb) {
    if (nb % i == 0) return 0;
    i++;
}
return 1;
\`\`\`
<!-- HINT_END -->`,

ft_realloc_safe: `## Objectif

Implémenter \`ft_realloc_safe\`, un **wrapper sécurisé pour \`realloc\`** qui préserve le pointeur original en cas d'échec.

## Le problème natif

\`\`\`c
ptr = realloc(ptr, new_size); // ❌ si échec : ptr = NULL, bloc original perdu
\`\`\`

## Prototype

\`\`\`c
void *ft_realloc_safe(void **ptr, size_t new_size);
\`\`\`

## Comportement

- Succès : \`*ptr\` est mis à jour, retourne le nouveau pointeur
- Échec : \`*ptr\` reste **inchangé**, retourne \`NULL\`
- \`new_size == 0\` : libère \`*ptr\`, le met à \`NULL\`, retourne \`NULL\`

## Exemple d'utilisation

\`\`\`c
int *arr = malloc(sizeof(int) * 5);
if (!ft_realloc_safe((void **)&arr, sizeof(int) * 10)) {
    // arr pointe toujours sur l'ancien bloc — pas de fuite mémoire
    printf("échec, ancien bloc préservé\\n");
}
\`\`\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`\`\`c
void *tmp = realloc(*ptr, new_size);
if (!tmp)
    return (NULL);  // *ptr inchangé
*ptr = tmp;
return (tmp);
\`\`\`
<!-- HINT_END -->`,

ft_btree: `## Objectif

Implémenter les opérations d'un **arbre binaire de recherche (BST)**.

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
t_btree *create_node(int value);
void     insert_node(t_btree **root, int value);
void     print_inorder(t_btree *root);
void     free_tree(t_btree *root);
\`\`\`

## Propriété BST

Pour tout nœud \`n\` : valeurs gauche **< n** ≤ valeurs droite.

## Exemple

\`\`\`
Insertion : 5, 3, 7, 1, 4
         5
        / \\
       3   7
      / \\
     1   4

print_inorder → 1 3 4 5 7
\`\`\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

**insert_node** : comparer \`value\` avec \`(*root)->value\`, recurser à gauche si inférieur, à droite sinon.

**print_inorder** : gauche → nœud → droite (donne l'ordre croissant).

**free_tree** : post-order (libérer les feuilles avant les parents).
<!-- HINT_END -->`,

ft_graph: `## Objectif

Implémenter un **graphe non orienté** par liste d'adjacence avec parcours BFS et DFS.

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
t_graph *create_graph(int vertices);
void     add_edge(t_graph *graph, int src, int dest);
void     print_graph(t_graph *graph);
void     bfs(t_graph *graph, int start);
void     dfs(t_graph *graph, int start, int *visited);
\`\`\`

## Exemple

\`\`\`
Arêtes : 0-1, 0-2, 1-3, 2-3
BFS depuis 0 : 0 1 2 3
DFS depuis 0 : 0 1 3 2
\`\`\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

**BFS** : utiliser une file (tableau circulaire ou liste). Marquer les sommets visités.

**DFS** : récursif. Parcourir la liste d'adjacence du sommet courant, recurser sur les non visités.

**add_edge** (non orienté) : ajouter \`dest\` à \`adj_list[src]\` ET \`src\` à \`adj_list[dest]\`.
<!-- HINT_END -->`,

ft_csv_parser: `## Objectif

Implémenter \`parse_csv_line\` qui décompose une **ligne CSV** en tableau de chaînes.

## Prototype

\`\`\`c
char **parse_csv_line(char *line);
void   free_fields(char **fields);
\`\`\`

## Exemples

\`\`\`
parse_csv_line("John,Doe,30,Engineer")
→ ["John", "Doe", "30", "Engineer", NULL]

parse_csv_line("Alice")
→ ["Alice", NULL]
\`\`\`

## Contraintes

- Chaque champ est une copie indépendante (allouée dynamiquement)
- Le tableau est terminé par \`NULL\`
- \`free_fields\` libère chaque champ **et** le tableau lui-même

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`strtok(line, ",")\` coupe la chaîne selon la virgule. Appeler en boucle avec \`NULL\` pour le premier argument après le premier appel, et \`strdup\` chaque token.
<!-- HINT_END -->`,

ft_json_simple: `## Objectif

Implémenter un **parser de champ JSON** capable d'extraire une paire clé/valeur d'une ligne JSON à plat.

## Structure

\`\`\`c
typedef struct s_json_field {
    char *key;
    char *value;
} t_json_field;
\`\`\`

## Prototype

\`\`\`c
t_json_field *parse_json_field(char *str);
void          print_json_field(t_json_field *field);
void          free_field(t_json_field *field);
\`\`\`

## Format d'entrée

\`\`\`
  "clé": "valeur"
\`\`\`

## Exemples

\`\`\`
parse_json_field("  \\"name\\": \\"Alice\\"")
→ key = "name"  value = "Alice"

parse_json_field("  \\"age\\": \\"30\\"")
→ key = "age"   value = "30"
\`\`\`

## Contraintes

- Pas de nesting, pas de tableaux — un seul niveau
- Clé et valeur entre guillemets doubles
- \`free_field\` libère \`key\`, \`value\` et le struct

<!-- HINT_START -->
## 💡 Indice (mode facile)

Utiliser \`strchr(str, ':')\` pour localiser le séparateur, puis extraire la sous-chaîne entre guillemets à gauche et à droite.
<!-- HINT_END -->`,

executor: `## Objectif

Implémenter les fonctions d'**exécution de commandes** d'un minishell : dispatcher entre built-ins et commandes externes, et exécuter les commandes externes via \`fork\` + \`execve\`.

## Structures et prototypes

\`\`\`c
typedef struct s_cmd {
    char  *name;   // ex: "echo"
    char **args;   // ex: {"echo", "hello", NULL}
} t_cmd;

int execute_command(t_cmd *cmd, char **env);
int execute_external(t_cmd *cmd, char **env);
\`\`\`

## Comportement

- \`execute_command\` : dispatche vers \`execute_builtin\` si built-in, sinon \`execute_external\`
- \`execute_external\` : \`fork()\`, puis \`execve()\` dans le fils ; \`waitpid()\` dans le parent
- Chercher la commande dans \`/bin/\` puis \`/usr/bin/\` si chemin non absolu
- Commande introuvable → message d'erreur + retourner \`127\`

## Valeurs de retour

\`\`\`
execute_external("/usr/bin/true", ...) → 0
execute_external("/usr/bin/false", ...) → 1
execute_external("commande_inconnue", ...) → 127
\`\`\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`\`\`c
pid_t pid = fork();
if (pid == 0) {
    execve(cmd->name, cmd->args, env);
    // Si échec, essayer /bin/ puis /usr/bin/
    exit(127);
}
waitpid(pid, &status, 0);
return (WEXITSTATUS(status));
\`\`\`
<!-- HINT_END -->`,

ft_file_search: `## Objectif

Implémenter \`ft_file_search\` qui lit un fichier ligne par ligne et affiche chaque ligne contenant le pattern, précédée de son numéro.

## Prototype

\`\`\`c
void ft_file_search(const char *filename, const char *pattern);
\`\`\`

## Format de sortie

\`\`\`
numéro: contenu de la ligne
\`\`\`

## Exemple

\`\`\`
Fichier :        ft_file_search("f.txt", "hello") :
  1: bonjour       →  2: hello world
  2: hello world   →  4: hello again
  3: foo bar
  4: hello again
\`\`\`

## Contraintes

- Utiliser \`fopen\` / \`fgets\` / \`fclose\`
- Si fichier introuvable : \`perror\` + retour immédiat
- Numérotation commence à \`1\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`strstr(line, pattern)\` retourne un pointeur non-NULL si le pattern est trouvé dans \`line\`.
<!-- HINT_END -->`,

ft_hexdump: `## Objectif

Implémenter \`ft_hexdump\` qui affiche le contenu d'un fichier en **format hexadécimal** (style \`hexdump -C\`).

## Prototype

\`\`\`c
void ft_hexdump(const char *filename);
\`\`\`

## Format de sortie (16 octets par ligne)

\`\`\`
00000000  48 65 6c 6c 6f 2c 20 57  6f 72 6c 64 21 0a      |Hello, World!.|
\`\`\`

- **Colonne 1** : offset en hexa sur 8 chiffres
- **Colonne 2** : octets en hexa séparés par espaces (espace supplémentaire après le 8ème)
- **Colonne 3** : entre \`|..|\`, caractères imprimables (ASCII 32-126) ou \`.\`

## Contraintes

- Utiliser \`open\` / \`read\` / \`close\`
- Lire par blocs de 16 octets
- Gérer la dernière ligne incomplète avec des espaces de remplissage

<!-- HINT_START -->
## 💡 Indice (mode facile)

\`\`\`c
printf("%08x  ", offset);  // offset
for (i = 0; i < 16; i++) {
    if (i < size) printf("%02x ", buffer[i]);
    else          printf("   ");
    if (i == 7)   printf(" ");
}
printf(" |");
for (i = 0; i < size; i++)
    printf("%c", (buffer[i] >= 32 && buffer[i] <= 126) ? buffer[i] : '.');
printf("|\\n");
\`\`\`
<!-- HINT_END -->`,

dictionary: `## Objectif

Implémenter un **dictionnaire clé/valeur** basé sur une table de hachage avec gestion des collisions par chaînage.

## Structures

\`\`\`c
typedef struct s_entry {
    char            *key;
    char            *value;
    struct s_entry  *next;
} t_entry;

typedef struct s_dict {
    t_entry **buckets;
    size_t    size;
    int       count;
} t_dict;
\`\`\`

## Fonctions à implémenter

\`\`\`c
t_dict *dict_create(size_t size);
void    dict_set(t_dict *dict, const char *key, const char *value);
char   *dict_get(t_dict *dict, const char *key);
void    dict_delete(t_dict *dict, const char *key);
void    dict_free(t_dict *dict);
\`\`\`

## Exemple

\`\`\`
dict_set(d, "name", "Alice");
dict_set(d, "age",  "30");
dict_get(d, "name")  → "Alice"
dict_get(d, "xyz")   → NULL
dict_delete(d, "age");
dict_get(d, "age")   → NULL
\`\`\`

<!-- HINT_START -->
## 💡 Indice (mode facile)

Fonction de hachage **djb2** fournie :
\`\`\`c
unsigned long hash(const char *str, size_t size) {
    unsigned long h = 5381;
    int c;
    while ((c = *str++))
        h = ((h << 5) + h) + c;
    return (h % size);
}
\`\`\`

Pour \`dict_set\` : si la clé existe déjà dans le bucket, mettre à jour \`value\`. Sinon créer un nouvel \`s_entry\` et l'insérer en tête du bucket.
<!-- HINT_END -->`,

};

async function main() {
    console.log('\n🔧 Fix statements 42/Épita-style — hints cachés via <!-- HINT_START/END -->\n');
    let updated = 0;

    for (const [slug, statement] of Object.entries(statements)) {
        const r = await db.listDocuments(DB, 'c-exercises', [
            Query.equal('slug', slug), Query.limit(1)
        ]);
        if (!r.documents.length) { console.log(`  ⚠️  ${slug}: introuvable`); continue; }

        await db.updateDocument(DB, 'c-exercises', r.documents[0].$id, { statement });
        const hintCount = (statement.match(/HINT_START/g) || []).length;
        console.log(`  ✅ ${slug} (${statement.length} chars, ${hintCount} hint caché)`);
        updated++;
    }

    console.log(`\n✨ ${updated} statements mis à jour !\n`);
}

main().catch(err => { console.error('Erreur:', err); process.exit(1); });
