# Good Regex

## Philosophie

Les expressions régulières sont puissantes mais peuvent devenir illisibles. Utilisez-les judicieusement.

## Littéral vs Constructor

```javascript
// ✅ Littéral (préféré pour patterns statiques)
const pattern = /hello/gi;

// Constructor (pour patterns dynamiques)
const search = 'hello';
const pattern = new RegExp(search, 'gi');
```

## Méthodes essentielles

```javascript
const text = 'Hello World';
const pattern = /world/i;

// Test: retourne boolean
pattern.test(text);  // true

// Match: retourne les correspondances
text.match(/o/g);  // ['o', 'o']

// Replace: remplace
text.replace(/world/i, 'JavaScript');  // 'Hello JavaScript'

// Split: divise
'a,b,c'.split(/,/);  // ['a', 'b', 'c']
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 29 | Regex Basics | test, match, replace |
| 30 | Character Classes | \\d, \\w, \\s, [...] |
| 31 | Groups & Capturing | (...), (?:...), (?<name>...) |
| 32 | Practical Patterns | Email, URL, téléphone, etc. |
