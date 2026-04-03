# Ex05 - Boxing & Unboxing

## Objectif
Comprendre l'auto-boxing des primitifs et les object wrappers.

## Contexte
Quand tu appelles une méthode sur un primitif (`"hello".toUpperCase()`), JavaScript crée temporairement un objet wrapper (boxing), appelle la méthode, puis jette l'objet. C'est pourquoi les primitifs semblent avoir des méthodes.

## Instructions

### `box1()`
```javascript
const temp = Object("hello");
return typeof temp;
```
Quel est le type d'un primitif "boxé" ?

### `box2()`
```javascript
const str = "hello";
str.custom = "test";
return str.custom;
```
Peut-on ajouter une propriété à un primitif ?

### `box3()`
```javascript
const strObj = new String("hello");
strObj.custom = "test";
return strObj.custom;
```
Et sur un objet wrapper créé explicitement ?

### `box4()` - `typeof new Number(42)`
Quel est le type d'un Number wrapper ?

### `box5()` - `new Number(42) === 42`
Un Number wrapper est-il strictement égal au primitif ?

### `box6()` - `new Number(42) == 42`
Et avec l'égalité abstraite ?

## Indice
- `Object(primitive)` crée un wrapper
- `new String()`, `new Number()`, `new Boolean()` créent des wrappers
- Les wrappers sont des **objets**, pas des primitifs
- L'auto-boxing crée un objet **temporaire** qui est immédiatement jeté

## Concepts
- Auto-boxing
- Primitive wrappers (String, Number, Boolean)
- Temporary objects
- Object(value) boxing
- new String() vs String()
