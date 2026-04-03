# Ex05 - Dynamic Scope Dangers (Legacy)

## Objectif
Comprendre pourquoi certaines constructions legacy sont dangereuses.

## Contexte
JavaScript historiquement permettait des mécanismes de "dynamic scope". Ces constructions sont **fortement déconseillées** car elles créent des failles de sécurité et empêchent les optimisations.

> **AVERTISSEMENT SÉCURITÉ** : Cet exercice est purement éducatif.
> Il explique POURQUOI éviter ces patterns, pas comment les utiliser.

## Instructions

### `explainDynamicScopeDangers()`
Retourne un array listant les 5 dangers principaux de l'exécution dynamique de code :
1. Injection de code malveillant possible
2. Modification imprévue du scope parent
3. Performance dégradée (pas d'optimisation par le moteur)
4. Code difficile à analyser et débugger
5. Impossible à typer statiquement

### `safeAlternatives()`
Retourne un objet avec les alternatives sûres pour les cas d'usage courants :
```javascript
{
  "parser JSON": "JSON.parse()",
  "templates": "Template literals ou moteur de template",
  "configuration": "Objets/Maps avec clés prédéfinies",
  "dispatch dynamique": "Pattern Strategy avec Map de fonctions"
}
```

### `safeDispatch()`
Implémente le pattern Strategy (alternative sûre au code dynamique).
Doit retourner `8` pour l'opération `add(5, 3)`.

```javascript
const handlers = new Map([
  ["add", (a, b) => a + b],
  ["multiply", (a, b) => a * b]
]);

function execute(operation, a, b) {
  const handler = handlers.get(operation);
  if (!handler) throw new Error(`Unknown: ${operation}`);
  return handler(a, b);
}

return execute("add", 5, 3); // 8
```

## Concepts
- Dynamic code execution dangers
- Strategy pattern as safe alternative
- Strict mode restrictions
- Defense in depth
