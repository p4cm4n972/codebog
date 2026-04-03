# Ex08 - Template Literals

## Objectif
Maîtriser les template literals (littéraux de gabarits) ES6.

## Contexte
Les template literals utilisent les backticks (\`) au lieu des quotes. Ils permettent l'interpolation de variables, les chaînes multilignes, et les tagged templates pour des transformations personnalisées.

## Instructions

### `simpleInterpolation(name, age)`
Retourne une chaîne avec interpolation :
```javascript
simpleInterpolation("Alice", 30); // "My name is Alice and I am 30 years old."
```

### `expressionInterpolation(a, b)`
Retourne le résultat d'une expression dans le template :
```javascript
expressionInterpolation(3, 4); // "3 + 4 = 7"
```

### `multilineString()`
Retourne une chaîne sur plusieurs lignes (exactement 3 lignes) :
```
Line 1
Line 2
Line 3
```

### `nestedTemplate(items)`
Retourne une liste HTML générée à partir d'un array :
```javascript
nestedTemplate(["a", "b"]); // "<ul>\n  <li>a</li>\n  <li>b</li>\n</ul>"
```

### `conditionalTemplate(isLoggedIn, username)`
Retourne un message personnalisé :
- Si connecté : `"Welcome back, {username}!"`
- Sinon : `"Please log in."`

### `objectTemplate(person)`
Prend un objet `{ name, age, city }` et retourne :
```javascript
objectTemplate({ name: "Bob", age: 25, city: "Lyon" });
// "Bob, 25 ans, habite à Lyon."
```

## Exemple
```javascript
simpleInterpolation("Bob", 25);      // "My name is Bob and I am 25 years old."
expressionInterpolation(10, 5);      // "10 + 5 = 15"
multilineString();                    // "Line 1\nLine 2\nLine 3"
nestedTemplate(["x"]);               // "<ul>\n  <li>x</li>\n</ul>"
conditionalTemplate(true, "Alice");  // "Welcome back, Alice!"
objectTemplate({ name: "Eva", age: 28, city: "Paris" }); // "Eva, 28 ans, habite à Paris."
```

## Concepts
- Template literals avec backticks (\`)
- Interpolation avec ${expression}
- Expressions dans les templates
- Chaînes multilignes
- Templates imbriqués
