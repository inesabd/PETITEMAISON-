# Protocole d'Expérimentation - PETITEMAISON

## 1. Contexte

Développement d'une application e-commerce pour la vente de produits horrifiques (figurines, Blu-ray, jeux, livres).

## 2. Technologies Testées

### Frontend

| Technologie | Version | Rôle | Résultat |
|-------------|---------|------|----------|
| React | 19.2.0 | Framework UI | ✅ Adopté |
| TypeScript | 5.8.3 | Typage statique | ✅ Adopté |
| Vite | 7.1.7 | Build tool | ✅ Adopté |
| TanStack Router | 1.132.0 | Routing | ✅ Adopté |
| Tailwind CSS | 4.0.6 | Styling | ✅ Adopté |
| Bootstrap | 5.3.8 | Composants UI | ✅ Adopté |

### Backend

| Technologie | Version | Rôle | Résultat |
|-------------|---------|------|----------|
| Node.js | 20 LTS | Runtime | ✅ Adopté |
| Express | 5.2.1 | Framework API | ✅ Adopté |
| PostgreSQL | 16 | Base de données | ✅ Adopté |
| JWT | 9.0.3 | Authentification | ✅ Adopté |
| bcrypt | 6.0.0 | Hashage mots de passe | ✅ Adopté |

### Infrastructure

| Technologie | Rôle | Résultat |
|-------------|------|----------|
| Azure Static Web Apps | Hébergement frontend | ✅ Adopté |
| Azure App Service | Hébergement backend | ✅ Adopté |
| Azure PostgreSQL Flexible Server | Base de données managée | ✅ Adopté |
| GitHub Actions | CI/CD | ✅ Adopté |

## 3. Interactions entre Technologies

```
┌─────────────────────────────────────────────────────────────┐
│                     UTILISATEUR                              │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              AZURE STATIC WEB APPS                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  React 19 + TypeScript + Vite                       │    │
│  │  - TanStack Router (navigation SPA)                 │    │
│  │  - Tailwind + Bootstrap (UI)                        │    │
│  │  - Context API (état global: Auth, Cart)            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ API REST (HTTPS + CORS)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              AZURE APP SERVICE                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Node.js 20 + Express 5                             │    │
│  │  - JWT (authentification stateless)                 │    │
│  │  - bcrypt (hashage sécurisé)                        │    │
│  │  - CORS (sécurité cross-origin)                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │ SQL (SSL/TLS)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│          AZURE POSTGRESQL FLEXIBLE SERVER                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  PostgreSQL 16                                      │    │
│  │  - Tables: utilisateurs, produits                   │    │
│  │  - SSL obligatoire                                  │    │
│  │  - Firewall Azure                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 4. Difficultés Rencontrées

### 4.1 Configuration CORS

**Problème** : Le frontend (Static Web App) ne pouvait pas communiquer avec le backend (App Service) - erreur `Access-Control-Allow-Origin`.

**Cause** : La variable `FRONTEND_URL` n'était pas configurée dans les variables d'environnement Azure.

**Solution** :
- Ajout de `FRONTEND_URL` dans les variables d'environnement du backend
- Configuration CORS dynamique basée sur cette variable
- Redémarrage du backend après modification

### 4.2 Connexion PostgreSQL

**Problème** : Erreur 500 sur les endpoints nécessitant la base de données.

**Causes identifiées** :
1. Format `DB_USER` incorrect (utilisait `user@server` au lieu de `user`)
2. Mot de passe PostgreSQL non synchronisé avec les variables d'environnement

**Solution** :
- Correction du format `DB_USER` pour Azure Flexible Server
- Réinitialisation du mot de passe PostgreSQL
- Synchronisation avec les variables d'environnement du backend

### 4.3 Authentification Utilisateur

**Problème** : Erreur 401 lors de la connexion avec l'utilisateur créé en SQL.

**Cause** : Le hash bcrypt inséré manuellement ne correspondait pas au mot de passe.

**Solution** : Création des utilisateurs via l'interface d'inscription (qui génère le bon hash bcrypt).

### 4.4 SSL PostgreSQL

**Problème** : Connexion refusée en production.

**Cause** : SSL non activé dans la configuration du pool PostgreSQL.

**Solution** : Configuration conditionnelle SSL basée sur `NODE_ENV`:
```javascript
ssl: process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : false
```

## 5. Résultats et Validation

### Tests de Validation

| Test | URL | Résultat |
|------|-----|----------|
| Health check | `/` | ✅ "Backend OK" |
| Liste utilisateurs | `/users` | ✅ JSON array |
| Liste produits | `/products` | ✅ 16 produits |
| Recherche | `/products?search=evil` | ✅ Filtrage OK |
| Inscription | `/auth/register` | ✅ Création compte |
| Connexion | `/auth/login` | ✅ Token JWT retourné |

### Métriques de Performance

| Métrique | Valeur |
|----------|--------|
| Temps de build frontend | ~16s |
| Temps de déploiement backend | ~31s |
| Temps de déploiement frontend | ~51s |
| Temps total CI/CD | ~2 minutes |

## 6. Décision d'Adoption

Toutes les technologies testées ont été **validées et adoptées** pour les raisons suivantes :

| Technologie | Justification |
|-------------|---------------|
| React 19 | Écosystème mature, hooks performants, large communauté |
| TypeScript | Typage strict évite les bugs, meilleure maintenabilité |
| Express 5 | Léger, flexible, large adoption industrie |
| PostgreSQL | Robuste, SQL standard, excellent support Azure |
| Azure | Crédits étudiants, services managés, intégration GitHub |
| GitHub Actions | Gratuit, intégré au repo, simple à configurer |

## 7. Recommandations Futures

1. **Ajouter des tests automatisés** (unitaires, intégration)
2. **Implémenter un rate limiting** sur les endpoints d'authentification
3. **Ajouter Helmet.js** pour les headers de sécurité
4. **Migrer vers TypeScript** pour le backend
5. **Ajouter un système de cache** (Redis) pour les produits
