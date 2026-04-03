# Ex29 - Regex Basics

## Objectif
Maîtriser les bases des expressions régulières.

## test()

```javascript
// Vérifie si le pattern correspond
/hello/.test('hello world');  // true
/HELLO/i.test('hello');       // true (i = case insensitive)
```

## match()

```javascript
// Trouve les correspondances
'hello world'.match(/o/);   // ['o'] (première)
'hello world'.match(/o/g);  // ['o', 'o'] (toutes avec g)

// Avec groupes
'hello world'.match(/(\w+) (\w+)/);
// ['hello world', 'hello', 'world']
```

## replace()

```javascript
// Remplacement simple
'hello'.replace(/l/g, 'L');  // 'heLLo'

// Avec références
'John Doe'.replace(/(\w+) (\w+)/, '$2, $1');  // 'Doe, John'

// Avec fonction
'hello'.replace(/./g, c => c.toUpperCase());  // 'HELLO'
```

## Flags

- `g` - global (toutes les occurrences)
- `i` - case insensitive
- `m` - multiline (^ et $ pour chaque ligne)
- `s` - dotAll (. matche aussi \\n)
- `u` - unicode
