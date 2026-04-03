# Ex00 - Destructuring Deep

## Objectif
Maîtriser la déstructuration imbriquée, les valeurs par défaut et le rest.

## Contexte
La déstructuration permet d'extraire des valeurs d'objets et de tableaux de manière concise. Elle supporte des cas avancés : renommage, valeurs par défaut, imbrication et rest.

## Instructions

### `destruct1()` - Déstructuration basique
```javascript
const { a, b } = { a: 1, b: 2, c: 3 };
return [a, b];
```

### `destruct2()` - Valeur par défaut
```javascript
const { a, b = 10 } = { a: 1 };
return [a, b];
```

### `destruct3()` - Renommage
```javascript
const { a: x, b: y } = { a: 1, b: 2 };
return [x, y];
```

### `destruct4()` - Imbrication profonde
```javascript
const { a: { b: { c } } } = { a: { b: { c: 42 } } };
return c;
```

### `destruct5()` - Array avec trous
```javascript
const [first, , third] = [1, 2, 3, 4];
return [first, third];
```

### `destruct6()` - Array rest
```javascript
const [head, ...tail] = [1, 2, 3, 4];
return [head, tail];
```

### `destruct7()` - Object rest
```javascript
const { a, ...rest } = { a: 1, b: 2, c: 3 };
return [a, rest];
```

### `destruct8()` - null vs undefined
```javascript
const { a = 1, b = 2 } = { a: undefined, b: null };
return [a, b];
```

## Indice
- Les valeurs par défaut ne s'appliquent qu'à `undefined`, pas `null`
- Le rest (`...`) collecte les éléments restants
- Le renommage utilise la syntaxe `original: nouveau`

## Concepts
- Object destructuring
- Array destructuring
- Default values
- Rest pattern
- Nested destructuring
