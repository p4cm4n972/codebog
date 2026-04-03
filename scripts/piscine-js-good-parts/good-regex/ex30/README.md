# Ex30 - Character Classes

## Objectif
Maîtriser les classes de caractères prédéfinies et personnalisées.

## Classes prédéfinies

```javascript
// \d - chiffre [0-9]
'abc123'.match(/\d+/);  // ['123']

// \w - mot [a-zA-Z0-9_]
'hello_world 123'.match(/\w+/g);  // ['hello_world', '123']

// \s - espace [ \t\n\r\f]
'hello world'.split(/\s+/);  // ['hello', 'world']

// Négations
// \D - non-chiffre
// \W - non-mot
// \S - non-espace
```

## Classes personnalisées

```javascript
// [abc] - a, b ou c
'cat bat rat'.match(/[cbr]at/g);  // ['cat', 'bat', 'rat']

// [a-z] - plage
'Hello123'.match(/[a-z]+/gi);  // ['Hello']

// [^abc] - négation
'hello'.match(/[^aeiou]+/g);  // ['h', 'll']
```

## Quantificateurs

```javascript
/a+/    // 1 ou plus
/a*/    // 0 ou plus
/a?/    // 0 ou 1
/a{3}/  // exactement 3
/a{2,4}/ // 2 à 4
/a{2,}/ // 2 ou plus
```
