# Piscine JS Browser

## Saison 4 - JavaScript dans le Navigateur

Après avoir maîtrisé les fondamentaux du langage, il est temps de l'appliquer dans son environnement naturel : le navigateur web.

## Objectifs

- Manipuler le DOM (Document Object Model)
- Gérer les événements utilisateur
- Valider et traiter les formulaires
- Communiquer avec des APIs (Fetch)
- Stocker des données côté client
- Dessiner avec Canvas
- Créer des applications interactives

## Modules

| Module | Exercices | Thème |
|--------|-----------|-------|
| **dom-basics** | ex00-ex05 | Sélection, création, modification du DOM |
| **dom-events** | ex06-ex11 | Événements, bubbling, delegation |
| **dom-forms** | ex12-ex16 | Formulaires, validation, inputs |
| **dom-async** | ex17-ex22 | Fetch API, Promises, JSON |
| **dom-storage** | ex23-ex26 | localStorage, sessionStorage |
| **dom-canvas** | ex27-ex31 | Dessin 2D, animations |
| **dom-projects** | ex32-ex35 | Mini-projets complets |

## Prérequis

- Saison 1, 2 ou 3 complétée (ou équivalent)
- Compréhension des fonctions, closures, et async/await

## Environnement de test

Les tests utilisent **jsdom** pour simuler un environnement navigateur.
Certains exercices incluent des fichiers HTML pour tester visuellement.

## Lancer les tests

```bash
cd piscine-js-browser
npm test           # Mode watch
npm run test:run   # Une seule exécution
```

## Philosophie

> "Le DOM est l'interface entre JavaScript et le monde visuel.
> Maîtrisez-le, et vous pouvez créer n'importe quelle expérience web."
