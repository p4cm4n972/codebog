/**
 * fix-cbog-missing-testcode.ts
 *
 * Écrit le testCode (et starterCode si besoin) pour les 9 exercices CBOG
 * qui avaient un testCode vide et donc acceptaient n'importe quel code compilable.
 *
 * Convention CBOG_PREAMBLE :
 *   Quand le code de l'utilisateur référence un type défini dans testCode
 *   (ex: t_list), le testCode contient la ligne "/* CBOG_PREAMBLE *\/"
 *   comme marqueur. buildSource() met alors la partie avant ce marqueur
 *   AVANT le code utilisateur (includes, structs, helpers), puis le reste
 *   APRÈS (int main avec les tests).
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
const COL = 'c-exercises';

// ---------------------------------------------------------------------------
// TestCode + starterCode pour chaque exercice
// ---------------------------------------------------------------------------

const exercises: Record<string, { testCode: string; starterCode?: string }> = {

    // ── ft_swap ─────────────────────────────────────────────────────────────
    ft_swap: {
        starterCode: `#include <stdio.h>

/* Échangez les valeurs pointées par a et b */
void\tft_swap(int *a, int *b)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>

int main(void)
{
\tint passed = 0, failed = 0;

\t/* Test 1 : valeurs positives */
\tint a = 5, b = 10;
\tft_swap(&a, &b);
\tif (a == 10 && b == 5) { printf("[PASS] swap(5, 10) -> a=10, b=5\\n"); passed++; }
\telse { printf("[FAIL] swap(5, 10): attendu a=10 b=5, obtenu a=%d b=%d\\n", a, b); failed++; }

\t/* Test 2 : négatif / positif */
\tint x = -3, y = 42;
\tft_swap(&x, &y);
\tif (x == 42 && y == -3) { printf("[PASS] swap(-3, 42) -> x=42, y=-3\\n"); passed++; }
\telse { printf("[FAIL] swap(-3, 42): attendu x=42 y=-3, obtenu x=%d y=%d\\n", x, y); failed++; }

\t/* Test 3 : même valeur */
\tint p = 7, q = 7;
\tft_swap(&p, &q);
\tif (p == 7 && q == 7) { printf("[PASS] swap(7, 7) -> inchangé\\n"); passed++; }
\telse { printf("[FAIL] swap(7, 7): attendu 7,7 obtenu %d,%d\\n", p, q); failed++; }

\t/* Test 4 : zéro */
\tint m = 0, n = 99;
\tft_swap(&m, &n);
\tif (m == 99 && n == 0) { printf("[PASS] swap(0, 99) -> m=99, n=0\\n"); passed++; }
\telse { printf("[FAIL] swap(0, 99): attendu m=99 n=0, obtenu m=%d n=%d\\n", m, n); failed++; }

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_sort_int_tab ─────────────────────────────────────────────────────
    ft_sort_int_tab: {
        starterCode: `#include <stdio.h>

/*
** Trie le tableau tab de taille size par ordre croissant.
** Algorithme au choix (bubble sort, selection sort...).
*/
void\tft_sort_int_tab(int *tab, int size)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <string.h>

static void check(int *arr, int *exp, int n, const char *label,
                  int *passed, int *failed)
{
\tif (memcmp(arr, exp, n * sizeof(int)) == 0)
\t{ printf("[PASS] %s\\n", label); (*passed)++; }
\telse
\t{
\t\tprintf("[FAIL] %s: obtenu [", label);
\t\tfor (int i = 0; i < n; i++) printf("%d%s", arr[i], i<n-1?",":"");
\t\tprintf("]\\n");
\t\t(*failed)++;
\t}
}

int main(void)
{
\tint passed = 0, failed = 0;

\tint arr1[] = {5, 3, 8, 1, 9, 2};
\tint exp1[] = {1, 2, 3, 5, 8, 9};
\tft_sort_int_tab(arr1, 6);
\tcheck(arr1, exp1, 6, "sort [5,3,8,1,9,2] -> [1,2,3,5,8,9]", &passed, &failed);

\tint arr2[] = {42};
\tint exp2[] = {42};
\tft_sort_int_tab(arr2, 1);
\tcheck(arr2, exp2, 1, "sort [42] -> [42] (un seul element)", &passed, &failed);

\tint arr3[] = {-5, -1, -10, 0};
\tint exp3[] = {-10, -5, -1, 0};
\tft_sort_int_tab(arr3, 4);
\tcheck(arr3, exp3, 4, "sort [-5,-1,-10,0] -> [-10,-5,-1,0] (negatifs)", &passed, &failed);

\tint arr4[] = {4, 3, 2, 1};
\tint exp4[] = {1, 2, 3, 4};
\tft_sort_int_tab(arr4, 4);
\tcheck(arr4, exp4, 4, "sort [4,3,2,1] -> [1,2,3,4] (inverse)", &passed, &failed);

\tint arr5[] = {1, 1, 2, 1};
\tint exp5[] = {1, 1, 1, 2};
\tft_sort_int_tab(arr5, 4);
\tcheck(arr5, exp5, 4, "sort [1,1,2,1] -> [1,1,1,2] (doublons)", &passed, &failed);

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_rev_int_tab ──────────────────────────────────────────────────────
    ft_rev_int_tab: {
        starterCode: `#include <stdio.h>

/*
** Inverse l'ordre des éléments du tableau tab (de taille size) en place.
** [1,2,3] -> [3,2,1]
*/
void\tft_rev_int_tab(int *tab, int size)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <string.h>

static void check(int *arr, int *exp, int n, const char *label,
                  int *passed, int *failed)
{
\tif (memcmp(arr, exp, n * sizeof(int)) == 0)
\t{ printf("[PASS] %s\\n", label); (*passed)++; }
\telse
\t{
\t\tprintf("[FAIL] %s: obtenu [", label);
\t\tfor (int i = 0; i < n; i++) printf("%d%s", arr[i], i<n-1?",":"");
\t\tprintf("]\\n");
\t\t(*failed)++;
\t}
}

int main(void)
{
\tint passed = 0, failed = 0;

\tint arr1[] = {1, 2, 3, 4, 5};
\tint exp1[] = {5, 4, 3, 2, 1};
\tft_rev_int_tab(arr1, 5);
\tcheck(arr1, exp1, 5, "reverse [1,2,3,4,5] -> [5,4,3,2,1]", &passed, &failed);

\tint arr2[] = {10, 20};
\tint exp2[] = {20, 10};
\tft_rev_int_tab(arr2, 2);
\tcheck(arr2, exp2, 2, "reverse [10,20] -> [20,10]", &passed, &failed);

\tint arr3[] = {42};
\tint exp3[] = {42};
\tft_rev_int_tab(arr3, 1);
\tcheck(arr3, exp3, 1, "reverse [42] -> [42] (un seul element)", &passed, &failed);

\tint arr4[] = {-3, 0, 7, -1, 5};
\tint exp4[] = {5, -1, 7, 0, -3};
\tft_rev_int_tab(arr4, 5);
\tcheck(arr4, exp4, 5, "reverse [-3,0,7,-1,5] -> [5,-1,7,0,-3] (mixte)", &passed, &failed);

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_list_reverse ─────────────────────────────────────────────────────
    // Utilise /* CBOG_PREAMBLE */ pour que t_list soit défini AVANT le code user
    ft_list_reverse: {
        starterCode: `#include <stdlib.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

/*
** Inverse l'ordre des maillons de la liste en place.
** Avant : [A -> B -> C]  Après : [C -> B -> A]
*/
void\tft_list_reverse(t_list **begin_list)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

static t_list\t*ft_create_elem(void *data)
{
\tt_list *e = malloc(sizeof(t_list));
\tif (!e) return (NULL);
\te->data = data; e->next = NULL;
\treturn (e);
}

static void\tft_list_push_back(t_list **begin, void *data)
{
\tt_list *n = ft_create_elem(data);
\tif (!*begin) { *begin = n; return; }
\tt_list *cur = *begin;
\twhile (cur->next) cur = cur->next;
\tcur->next = n;
}

static void\tft_list_free(t_list **list)
{
\twhile (*list) { t_list *tmp = *list; *list = (*list)->next; free(tmp); }
}

/* CBOG_PREAMBLE */

int\tmain(void)
{
\tint passed = 0, failed = 0;
\tt_list *list;

\t/* Test 1 : 4 elements */
\tlist = NULL;
\tint v[] = {1, 2, 3, 4};
\tfor (int i = 0; i < 4; i++) ft_list_push_back(&list, &v[i]);
\tft_list_reverse(&list);
\tint exp1[] = {4, 3, 2, 1};
\tint ok = 1;
\tt_list *cur = list;
\tfor (int i = 0; i < 4 && cur; i++, cur = cur->next)
\t\tif (*(int*)cur->data != exp1[i]) { ok = 0; break; }
\tif (ok && !cur) { printf("[PASS] reverse [1,2,3,4] -> [4,3,2,1]\\n"); passed++; }
\telse { printf("[FAIL] reverse [1,2,3,4]\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 2 : 2 elements */
\tlist = NULL;
\tint a = 10, b = 20;
\tft_list_push_back(&list, &a);
\tft_list_push_back(&list, &b);
\tft_list_reverse(&list);
\tif (list && *(int*)list->data == 20 && *(int*)list->next->data == 10)
\t\t{ printf("[PASS] reverse [10,20] -> [20,10]\\n"); passed++; }
\telse { printf("[FAIL] reverse [10,20]\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 3 : 1 element */
\tlist = NULL;
\tint solo = 42;
\tft_list_push_back(&list, &solo);
\tft_list_reverse(&list);
\tif (list && *(int*)list->data == 42 && !list->next)
\t\t{ printf("[PASS] reverse [42] -> [42] (inchange)\\n"); passed++; }
\telse { printf("[FAIL] reverse [42]\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 4 : liste vide */
\tlist = NULL;
\tft_list_reverse(&list);
\tif (!list) { printf("[PASS] reverse [] -> [] (liste vide)\\n"); passed++; }
\telse { printf("[FAIL] reverse []\\n"); failed++; }

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_list_remove_if ───────────────────────────────────────────────────
    ft_list_remove_if: {
        starterCode: `#include <stdlib.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

/*
** Supprime de la liste tous les maillons dont data correspond à data_ref
** selon la fonction cmp (cmp retourne 0 si égal).
** free_fct est appelée sur data de chaque maillon supprimé (peut être NULL).
*/
void\tft_list_remove_if(t_list **begin_list, void *data_ref,
\t\tint (*cmp)(), void (*free_fct)(void *))
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

static t_list\t*ft_create_elem(void *data)
{
\tt_list *e = malloc(sizeof(t_list));
\tif (!e) return (NULL);
\te->data = data; e->next = NULL;
\treturn (e);
}

static void\tft_list_push_back(t_list **begin, void *data)
{
\tt_list *n = ft_create_elem(data);
\tif (!*begin) { *begin = n; return; }
\tt_list *cur = *begin;
\twhile (cur->next) cur = cur->next;
\tcur->next = n;
}

static void\tft_list_free(t_list **list)
{
\twhile (*list) { t_list *tmp = *list; *list = (*list)->next; free(tmp); }
}

static int\tint_cmp(int *a, int *b) { return (*a - *b); }
static int\tstr_cmp(char *a, char *b) { return (strcmp(a, b)); }

static int\tlist_len(t_list *list)
{
\tint n = 0; while (list) { n++; list = list->next; } return (n);
}

/* CBOG_PREAMBLE */

int\tmain(void)
{
\tint passed = 0, failed = 0;
\tt_list *list;

\t/* Test 1 : supprimer tous les 5 */
\tlist = NULL;
\tint arr[] = {5, 10, 5, 20, 5, 30};
\tfor (int i = 0; i < 6; i++) ft_list_push_back(&list, &arr[i]);
\tint to_remove = 5;
\tft_list_remove_if(&list, &to_remove, (int(*)())int_cmp, NULL);
\tif (list_len(list) == 3)
\t\t{ printf("[PASS] remove_if supprime tous les 5 (reste 3 elements)\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] remove_if: attendu 3 elements, obtenu %d\\n", list_len(list)); failed++; }
\t/* Vérifie que les valeurs restantes sont 10, 20, 30 */
\tint exp[] = {10, 20, 30};
\tint ok = 1; t_list *cur = list;
\tfor (int i = 0; i < 3 && cur; i++, cur = cur->next)
\t\tif (*(int*)cur->data != exp[i]) { ok = 0; break; }
\tif (ok) { printf("[PASS] remove_if valeurs restantes [10,20,30]\\n"); passed++; }
\telse { printf("[FAIL] remove_if valeurs restantes incorrectes\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 2 : supprimer l'élément en tête */
\tlist = NULL;
\tint head_arr[] = {1, 2, 3};
\tfor (int i = 0; i < 3; i++) ft_list_push_back(&list, &head_arr[i]);
\tint rm1 = 1;
\tft_list_remove_if(&list, &rm1, (int(*)())int_cmp, NULL);
\tif (list && *(int*)list->data == 2)
\t\t{ printf("[PASS] remove_if supprime la tete [1,2,3] -> [2,3]\\n"); passed++; }
\telse { printf("[FAIL] remove_if suppression tete\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 3 : supprimer la queue */
\tlist = NULL;
\tint tail_arr[] = {1, 2, 3};
\tfor (int i = 0; i < 3; i++) ft_list_push_back(&list, &tail_arr[i]);
\tint rm3 = 3;
\tft_list_remove_if(&list, &rm3, (int(*)())int_cmp, NULL);
\tif (list_len(list) == 2)
\t\t{ printf("[PASS] remove_if supprime la queue [1,2,3] -> [1,2]\\n"); passed++; }
\telse { printf("[FAIL] remove_if suppression queue\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 4 : aucun match */
\tlist = NULL;
\tint no_match[] = {1, 2, 3};
\tfor (int i = 0; i < 3; i++) ft_list_push_back(&list, &no_match[i]);
\tint rm99 = 99;
\tft_list_remove_if(&list, &rm99, (int(*)())int_cmp, NULL);
\tif (list_len(list) == 3)
\t\t{ printf("[PASS] remove_if sans match laisse la liste intacte\\n"); passed++; }
\telse { printf("[FAIL] remove_if sans match\\n"); failed++; }
\tft_list_free(&list);

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_list_sort ────────────────────────────────────────────────────────
    ft_list_sort: {
        starterCode: `#include <stdlib.h>
#include <string.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

/*
** Trie la liste en utilisant la fonction cmp.
** cmp(a, b) < 0 → a avant b  |  cmp(a, b) > 0 → b avant a
*/
void\tft_list_sort(t_list **begin_list, int (*cmp)())
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct s_list
{
\tvoid\t\t*data;
\tstruct s_list\t*next;
}\tt_list;

static t_list\t*ft_create_elem(void *data)
{
\tt_list *e = malloc(sizeof(t_list));
\tif (!e) return (NULL);
\te->data = data; e->next = NULL;
\treturn (e);
}

static void\tft_list_push_back(t_list **begin, void *data)
{
\tt_list *n = ft_create_elem(data);
\tif (!*begin) { *begin = n; return; }
\tt_list *cur = *begin;
\twhile (cur->next) cur = cur->next;
\tcur->next = n;
}

static void\tft_list_free(t_list **list)
{
\twhile (*list) { t_list *tmp = *list; *list = (*list)->next; free(tmp); }
}

static int\tint_cmp(int *a, int *b) { return (*a - *b); }
static int\tstr_cmp(char *a, char *b) { return (strcmp(a, b)); }

/* CBOG_PREAMBLE */

int\tmain(void)
{
\tint passed = 0, failed = 0;
\tt_list *list;

\t/* Test 1 : tri d'entiers */
\tlist = NULL;
\tint arr[] = {42, 5, 18, 99, 3};
\tfor (int i = 0; i < 5; i++) ft_list_push_back(&list, &arr[i]);
\tft_list_sort(&list, (int(*)())int_cmp);
\tint exp1[] = {3, 5, 18, 42, 99};
\tint ok = 1; t_list *cur = list;
\tfor (int i = 0; i < 5 && cur; i++, cur = cur->next)
\t\tif (*(int*)cur->data != exp1[i]) { ok = 0; break; }
\tif (ok) { printf("[PASS] sort_int [42,5,18,99,3] -> [3,5,18,42,99]\\n"); passed++; }
\telse { printf("[FAIL] sort_int incorrecte\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 2 : tri de chaînes */
\tlist = NULL;
\tft_list_push_back(&list, "Zebra");
\tft_list_push_back(&list, "Alice");
\tft_list_push_back(&list, "Bob");
\tft_list_push_back(&list, "Charlie");
\tft_list_sort(&list, (int(*)())str_cmp);
\tchar *exp2[] = {"Alice", "Bob", "Charlie", "Zebra"};
\tok = 1; cur = list;
\tfor (int i = 0; i < 4 && cur; i++, cur = cur->next)
\t\tif (strcmp((char*)cur->data, exp2[i]) != 0) { ok = 0; break; }
\tif (ok) { printf("[PASS] sort_str [Zebra,Alice,Bob,Charlie] -> alphabetique\\n"); passed++; }
\telse { printf("[FAIL] sort_str incorrecte\\n"); failed++; }
\tft_list_free(&list);

\t/* Test 3 : liste vide */
\tlist = NULL;
\tft_list_sort(&list, (int(*)())int_cmp);
\tif (!list) { printf("[PASS] sort liste vide -> inchangee\\n"); passed++; }
\telse { printf("[FAIL] sort liste vide\\n"); failed++; }

\t/* Test 4 : un seul element */
\tlist = NULL;
\tint solo = 7;
\tft_list_push_back(&list, &solo);
\tft_list_sort(&list, (int(*)())int_cmp);
\tif (list && *(int*)list->data == 7 && !list->next)
\t\t{ printf("[PASS] sort [7] -> [7] (inchange)\\n"); passed++; }
\telse { printf("[FAIL] sort un seul element\\n"); failed++; }
\tft_list_free(&list);

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── executor ────────────────────────────────────────────────────────────
    // Exercice minishell — fournit t_cmd + stubs is_builtin/execute_builtin
    executor: {
        starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

typedef struct s_cmd
{
\tchar\t*name;   /* nom de la commande, ex: "echo" */
\tchar\t**args;  /* argv complet, ex: {"echo", "hello", NULL} */
}\tt_cmd;

/* Fourni par le shell — déclare si une commande est built-in */
int\tis_builtin(char *name);

/* Fourni par le shell — exécute un built-in */
int\texecute_builtin(t_cmd *cmd, char **env);

/* À implémenter : fork + execve, cherche dans /bin et /usr/bin */
int\texecute_external(t_cmd *cmd, char **env);

/* À implémenter : dispatch builtin vs externe */
int\texecute_command(t_cmd *cmd, char **env)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

typedef struct s_cmd
{
\tchar\t*name;
\tchar\t**args;
}\tt_cmd;

/* Stubs pour les built-ins (fournis par le shell) */
int\tis_builtin(char *name) { return (strcmp(name, "cd") == 0 || strcmp(name, "exit") == 0); }
int\texecute_builtin(t_cmd *cmd, char **env)
{
\t(void)env;
\tif (strcmp(cmd->name, "exit") == 0) return (0);
\treturn (0);
}

/* CBOG_PREAMBLE */

int\tmain(void)
{
\tint passed = 0, failed = 0;
\tchar *env[] = {NULL};

\t/* Test 1 : execute_external avec /usr/bin/true (toujours 0) */
\t{
\t\tchar *args[] = {"/usr/bin/true", NULL};
\t\tt_cmd cmd = { .name = "/usr/bin/true", .args = args };
\t\tint ret = execute_external(&cmd, env);
\t\tif (ret == 0) { printf("[PASS] execute_external /usr/bin/true -> exit 0\\n"); passed++; }
\t\telse { printf("[FAIL] execute_external /usr/bin/true: code=%d\\n", ret); failed++; }
\t}

\t/* Test 2 : execute_external avec /usr/bin/false (toujours 1) */
\t{
\t\tchar *args[] = {"/usr/bin/false", NULL};
\t\tt_cmd cmd = { .name = "/usr/bin/false", .args = args };
\t\tint ret = execute_external(&cmd, env);
\t\tif (ret != 0) { printf("[PASS] execute_external /usr/bin/false -> exit != 0\\n"); passed++; }
\t\telse { printf("[FAIL] execute_external /usr/bin/false: attendu exit != 0\\n"); failed++; }
\t}

\t/* Test 3 : execute_command dispatch builtin */
\t{
\t\tchar *args[] = {"exit", NULL};
\t\tt_cmd cmd = { .name = "exit", .args = args };
\t\tint ret = execute_command(&cmd, env);
\t\tif (ret == 0) { printf("[PASS] execute_command dispatche le builtin exit\\n"); passed++; }
\t\telse { printf("[FAIL] execute_command builtin exit: code=%d\\n", ret); failed++; }
\t}

\t/* Test 4 : execute_command dispatch externe */
\t{
\t\tchar *args[] = {"/usr/bin/true", NULL};
\t\tt_cmd cmd = { .name = "/usr/bin/true", .args = args };
\t\tint ret = execute_command(&cmd, env);
\t\tif (ret == 0) { printf("[PASS] execute_command dispatche /usr/bin/true\\n"); passed++; }
\t\telse { printf("[FAIL] execute_command externe: code=%d\\n", ret); failed++; }
\t}

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_file_search ──────────────────────────────────────────────────────
    ft_file_search: {
        starterCode: `#include <stdio.h>
#include <string.h>

/*
** Lit le fichier filename ligne par ligne et affiche (avec son numéro)
** chaque ligne contenant pattern.
** Format : "42: la ligne\\n"
*/
void\tft_file_search(const char *filename, const char *pattern)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
\tint passed = 0, failed = 0;
\tFILE *f;
\tchar buf[512];

\t/* Créer un fichier de test temporaire */
\tf = fopen("/tmp/cbog_search_test.txt", "w");
\tif (!f) { printf("[FAIL] impossible de créer /tmp/cbog_search_test.txt\\n"); return (1); }
\tfprintf(f, "bonjour monde\\n");
\tfprintf(f, "hello world\\n");
\tfprintf(f, "foo bar baz\\n");
\tfprintf(f, "hello again\\n");
\tfprintf(f, "fin du fichier\\n");
\tfclose(f);

\t/* Test 1 : recherche "hello" → lignes 2 et 4 */
\tf = popen("./a.out_search hello 2>&1 || true", "r");
\t/* On ne peut pas exécuter via popen, on redirige stdout */

\t/* Capture la sortie via pipe */
\tFILE *pipe_out = fopen("/tmp/cbog_search_out.txt", "w");
\tFILE *old_stdout = fdopen(dup(fileno(stdout)), "w");
\tdup2(fileno(pipe_out), fileno(stdout));
\tft_file_search("/tmp/cbog_search_test.txt", "hello");
\tfflush(stdout);
\tdup2(fileno(old_stdout), fileno(stdout));
\tfclose(pipe_out);
\tfclose(old_stdout);

\t/* Lire la sortie */
\tf = fopen("/tmp/cbog_search_out.txt", "r");
\tchar output[512] = "";
\tif (f) { fread(output, 1, sizeof(output)-1, f); fclose(f); }

\t/* Vérifier que les lignes 2 et 4 apparaissent */
\tif (strstr(output, "2:") && strstr(output, "hello world") &&
\t    strstr(output, "4:") && strstr(output, "hello again"))
\t\t{ printf("[PASS] ft_file_search trouve les 2 lignes 'hello'\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] ft_file_search: attendu lignes 2 et 4\\nObtenu: %s\\n", output); failed++; }

\t/* Test 2 : recherche sans résultat */
\tpipe_out = fopen("/tmp/cbog_search_out.txt", "w");
\told_stdout = fdopen(dup(fileno(stdout)), "w");
\tdup2(fileno(pipe_out), fileno(stdout));
\tft_file_search("/tmp/cbog_search_test.txt", "ZZZNOMATCH");
\tfflush(stdout);
\tdup2(fileno(old_stdout), fileno(stdout));
\tfclose(pipe_out);
\tfclose(old_stdout);
\tf = fopen("/tmp/cbog_search_out.txt", "r");
\tmemset(output, 0, sizeof(output));
\tif (f) { fread(output, 1, sizeof(output)-1, f); fclose(f); }
\tif (strlen(output) == 0)
\t\t{ printf("[PASS] ft_file_search sans résultat -> sortie vide\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] ft_file_search sans résultat: obtenu '%s'\\n", output); failed++; }

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },

    // ── ft_hexdump ──────────────────────────────────────────────────────────
    ft_hexdump: {
        starterCode: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

/*
** Affiche le contenu de filename en format hexadécimal.
** Format par ligne (16 octets max) :
**   "00000000  68 65 6c 6c 6f ...  |hello...|\\n"
*/
void\tft_hexdump(const char *filename)
{
\t// Votre code ici
}`,
        testCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(void)
{
\tint passed = 0, failed = 0;

\t/* Créer un fichier de test avec du contenu connu */
\tFILE *f = fopen("/tmp/cbog_hexdump_test.bin", "wb");
\tif (!f) { printf("[FAIL] impossible de creer le fichier de test\\n"); return (1); }
\tunsigned char data[] = "Hello, World!";
\tfwrite(data, 1, 13, f);
\tfclose(f);

\t/* Capturer la sortie de ft_hexdump */
\tFILE *pipe_out = fopen("/tmp/cbog_hexdump_out.txt", "w");
\tFILE *old_stdout = fdopen(dup(fileno(stdout)), "w");
\tdup2(fileno(pipe_out), fileno(stdout));
\tft_hexdump("/tmp/cbog_hexdump_test.bin");
\tfflush(stdout);
\tdup2(fileno(old_stdout), fileno(stdout));
\tfclose(pipe_out);
\tfclose(old_stdout);

\tchar output[1024] = "";
\tf = fopen("/tmp/cbog_hexdump_out.txt", "r");
\tif (f) { fread(output, 1, sizeof(output)-1, f); fclose(f); }

\t/* Test 1 : la sortie doit contenir les octets hex de "Hello" */
\tif (strstr(output, "48") && strstr(output, "65") && strstr(output, "6c"))
\t\t{ printf("[PASS] hexdump contient les octets hex de Hello (48 65 6c)\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] hexdump: octets hex manquants\\nObtenu: %s\\n", output); failed++; }

\t/* Test 2 : la sortie doit avoir une partie ASCII "|Hello...|" */
\tif (strstr(output, "Hello"))
\t\t{ printf("[PASS] hexdump contient la partie ASCII 'Hello'\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] hexdump: partie ASCII manquante\\nObtenu: %s\\n", output); failed++; }

\t/* Test 3 : l'offset 00000000 doit apparaitre */
\tif (strstr(output, "00000000"))
\t\t{ printf("[PASS] hexdump affiche l'offset 00000000\\n"); passed++; }
\telse
\t\t{ printf("[FAIL] hexdump: offset manquant\\n"); failed++; }

\tprintf("\\nResults: %d passed, %d failed\\n", passed, failed);
\treturn (failed);
}`,
    },
};

// ---------------------------------------------------------------------------
// Push vers Appwrite
// ---------------------------------------------------------------------------

async function main() {
    console.log('\n🔧 Fix testCode pour les 9 exercices CBOG sans harness\n');

    for (const [slug, data] of Object.entries(exercises)) {
        const r = await db.listDocuments(DB, COL, [Query.equal('slug', slug), Query.limit(1)]);
        if (!r.documents.length) {
            console.log(`  ⚠️  ${slug}: introuvable en base`);
            continue;
        }

        const docId = r.documents[0].$id;
        const update: Record<string, string> = { testCode: data.testCode };
        if (data.starterCode) update.starterCode = data.starterCode;

        await db.updateDocument(DB, COL, docId, update);
        console.log(`  ✅ ${slug}: testCode=${data.testCode.length} chars${data.starterCode ? ' + starterCode' : ''}`);
    }

    console.log('\n✨ Terminé !\n');
}

main().catch(err => { console.error('Erreur:', err); process.exit(1); });
