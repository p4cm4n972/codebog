# Piscine JS - The Good Parts

> Basé sur "JavaScript: The Good Parts" de Douglas Crockford

## Philosophie

Douglas Crockford a identifié un sous-ensemble de JavaScript qui est élégant, fiable et expressif. Cette piscine se concentre sur ces "bonnes parties" tout en évitant les pièges et les mauvaises pratiques.

> "JavaScript is a language with more than its share of bad parts. [...] JavaScript has some extraordinarily good parts. In JavaScript, there is a beautiful, elegant, highly expressive language that is buried under a steaming pile of good intentions and blunders."
> — Douglas Crockford

## Modules

### 1. Good Syntax (ex00-ex04)
Les bonnes pratiques syntaxiques : éviter les pièges, utiliser les bonnes constructions.

### 2. Good Objects (ex05-ex10)
Les objets comme collections dynamiques de propriétés - la véritable nature des objets JS.

### 3. Good Functions (ex11-ex18)
Les fonctions comme objets de première classe, closures, modules, et composition.

### 4. Good Inheritance (ex19-ex23)
L'héritage prototypal plutôt que classique - la voie de JavaScript.

### 5. Good Arrays (ex24-ex28)
Les tableaux et leurs méthodes puissantes.

### 6. Good Regex (ex29-ex32)
Les expressions régulières - un outil puissant quand bien utilisé.

### 7. Good Style (ex33-ex37)
Les patterns et conventions qui rendent le code maintenable.

## The Good Parts vs The Bad Parts

### ✅ Good Parts (utilisez-les)
- Object literals `{}`
- Array literals `[]`
- Functions as first-class objects
- Closures
- Prototypal inheritance
- `===` et `!==`
- Module pattern
- Functional methods (map, filter, reduce)

### ❌ Bad Parts (évitez-les)
- `==` et `!=` (coercion implicite)
- `with` statement
- Exécution dynamique de code (Function constructor)
- Global variables
- `new` avec constructeurs (préférer Object.create)
- `typeof null === 'object'`
- Semicolon insertion automatique
- `++` et `--` (source de confusion)

## Exécution des tests

```bash
cd scripts/piscine-js-good-parts
npm test
# ou
npx vitest
```

## Ressources

- "JavaScript: The Good Parts" - Douglas Crockford (O'Reilly)
- Crockford on JavaScript - Série de vidéos
- JSLint - L'outil de validation de Crockford
