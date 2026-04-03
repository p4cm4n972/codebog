# Ex31 - Groups & Capturing

## Objectif
Utiliser les groupes pour capturer et réutiliser des parties de la correspondance.

## Groupes capturants

```javascript
const match = 'John Doe'.match(/(\w+) (\w+)/);
// match[0] = 'John Doe' (correspondance complète)
// match[1] = 'John' (groupe 1)
// match[2] = 'Doe' (groupe 2)

// Dans replace
'John Doe'.replace(/(\w+) (\w+)/, '$2, $1');  // 'Doe, John'
```

## Groupes nommés (ES2018)

```javascript
const match = 'John Doe'.match(/(?<first>\w+) (?<last>\w+)/);
// match.groups.first = 'John'
// match.groups.last = 'Doe'

// Dans replace
'John Doe'.replace(
  /(?<first>\w+) (?<last>\w+)/,
  '$<last>, $<first>'
);
```

## Groupes non-capturants

```javascript
// (?:...) ne capture pas
'Mr. John or Ms. Jane'.match(/(?:Mr\.|Ms\.) (\w+)/g);
// On veut juste le prénom, pas le titre
```

## Alternation

```javascript
// | = ou
/cat|dog/.test('I have a cat');  // true
/cat|dog/.test('I have a dog');  // true
```
