# Ex03 - Strings & Unicode

## Objectif
Comprendre comment JavaScript gère les strings Unicode (UTF-16).

## Contexte
JavaScript utilise UTF-16 en interne. Cela signifie que certains caractères (emojis, caractères rares) utilisent des "surrogate pairs" (2 unités de code). La `.length` d'une string compte les unités de code, pas les caractères visuels (graphèmes).

## Instructions

### `str1()` - `"café".length`
Longueur d'un mot avec accent.

### `str2()` - `"👨‍👩‍👧".length`
Longueur de l'emoji famille (homme-femme-fille).
> Cet emoji est composé de plusieurs emojis joints par ZWJ (Zero Width Joiner).

### `str3()` - `"👨‍👩‍👧".split("").length`
Longueur après split caractère par caractère.

### `str4()` - `[..."👨‍👩‍👧"].length`
Longueur avec spread operator (itère par codepoint).

### `str5()` - Comparaison d'accents
```javascript
const a = "é";       // \u00E9 (caractère précomposé)
const b = "e\u0301"; // e + combining acute accent
return a === b;
```

### `str6()` - Normalize
```javascript
const a = "é".normalize();
const b = "e\u0301".normalize();
return a === b;
```

## Indice
- `"👨‍👩‍👧"` = 👨 + ZWJ + 👩 + ZWJ + 👧 = 5 codepoints
- Chaque emoji simple = 2 unités de code (surrogate pair)
- ZWJ = 1 unité de code
- Total: 2+1+2+1+2 = 8 unités de code

## Concepts
- UTF-16 encoding
- Surrogate pairs
- Codepoints vs code units
- Zero Width Joiner (ZWJ)
- String.normalize()
- Grapheme clusters
