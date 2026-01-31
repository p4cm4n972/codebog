# 🎯 Projet: CodeBog Web

> **Résumé en une ligne**: Plateforme d'apprentissage de code avec éditeur Monaco et système de gems

---

## 📋 Contexte Projet

**Type**: Plateforme d'apprentissage
**Statut**: En développement

---

## 🛠️ Stack Technique

### Frontend
- **Framework**: Next.js 16.1.1 + React 19
- **Styling**: Tailwind CSS 4
- **Éditeur**: Monaco Editor
- **Build**: Next.js CLI

### Backend
- **BaaS**: Appwrite (node-appwrite)
- **Paiements**: Stripe
- **Sandbox**: isolated-vm pour exécution de code

### Infrastructure
- **Tests**: Vitest + Testing Library + Playwright

---

## 🔧 Commandes Essentielles

```bash
npm install           # Installation
npm run dev           # Dev server
npm run build         # Build production
npm run test          # Tests Vitest
npm run test:run      # Tests en mode CI
npm run lint          # ESLint

# Scripts spécifiques
npm run sync:piscine      # Sync données piscine
npm run setup:submissions # Setup soumissions
npm run setup:gems        # Setup collections gems
```

---

## 📁 Architecture

```
/
├── src/              → Code source principal
├── scripts/          → Scripts de setup et migration
├── tests/            → Tests Playwright E2E
├── public/           → Assets statiques
└── coverage/         → Rapports de couverture
```

---

## ⚠️ Points d'Attention

- **isolated-vm**: Sandbox pour exécution sécurisée du code utilisateur
- **Appwrite**: Vérifier les permissions des collections
- **Monaco Editor**: Attention à la taille du bundle (lazy loading)

---

## 🤖 Instructions Claude

- Réponses en français
- Utiliser async/await (pas de .then())
- Tests obligatoires pour les nouvelles fonctionnalités
- Ne pas modifier les scripts de migration sans validation
