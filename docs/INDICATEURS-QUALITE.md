# Indicateurs de Qualité Logicielle - PETITEMAISON

## 1. Vue d'Ensemble

| Catégorie | Indicateur | Cible | Actuel | Status |
|-----------|------------|-------|--------|--------|
| Fonctionnalité | Taux de bugs critiques | 0 | 0 | ✅ |
| Performance | Temps de réponse API | < 500ms | ~200ms | ✅ |
| Maintenabilité | Couverture de tests | > 50% | 0% | ❌ |
| Fiabilité | Disponibilité | > 99% | ~99% | ✅ |

## 2. Indicateurs Détaillés

### 2.1 Fonctionnalité

**Objectif** : L'application répond aux besoins métier exprimés.

| Indicateur | Description | Mesure | Cible | Actuel |
|------------|-------------|--------|-------|--------|
| **Taux de bugs critiques** | Bugs bloquant une fonctionnalité | Nombre en production | 0 | 0 ✅ |
| **Couverture fonctionnelle** | Fonctionnalités implémentées vs prévues | % | 100% | 100% ✅ |
| **Taux de régression** | Bugs réintroduits après correction | % des bugs | < 5% | 0% ✅ |

**Fonctionnalités validées** :
- [x] Inscription utilisateur
- [x] Connexion avec JWT
- [x] Liste des produits
- [x] Recherche de produits
- [x] Filtre par catégorie
- [x] Panier (frontend)

### 2.2 Performance

**Objectif** : L'application répond rapidement aux sollicitations.

| Indicateur | Description | Mesure | Cible | Actuel |
|------------|-------------|--------|-------|--------|
| **Temps de réponse API** | Latence moyenne des endpoints | ms | < 500ms | ~200ms ✅ |
| **Time to First Byte (TTFB)** | Temps avant premier octet | ms | < 600ms | ~400ms ✅ |
| **Largest Contentful Paint** | Chargement contenu principal | s | < 2.5s | ~2s ✅ |
| **Temps de build CI** | Durée pipeline complet | min | < 5min | ~2min ✅ |

**Mesures réalisées** :

```
GET /                    → ~50ms
GET /products            → ~150ms
GET /products?search=x   → ~180ms
POST /auth/login         → ~250ms (bcrypt)
POST /auth/register      → ~300ms (bcrypt hash)
```

### 2.3 Maintenabilité

**Objectif** : Le code est facile à comprendre, modifier et étendre.

| Indicateur | Description | Mesure | Cible | Actuel |
|------------|-------------|--------|-------|--------|
| **Couverture de tests** | Lignes de code testées | % | > 50% | 0% ❌ |
| **Complexité cyclomatique** | Complexité des fonctions | Score moyen | < 10 | ~5 ✅ |
| **Dette technique** | Issues de qualité identifiées | Nombre | < 10 | ~15 ⚠️ |
| **Documentation** | Fichiers documentés | % | > 80% | ~60% ⚠️ |

**Dette technique identifiée** :

| Issue | Priorité | Effort |
|-------|----------|--------|
| Aucun test unitaire | Haute | 2j |
| Backend monolithique (1 fichier) | Moyenne | 1j |
| Pas de validation entrées (Zod) | Haute | 0.5j |
| Pas de middleware JWT | Haute | 0.5j |
| Pas d'ESLint configuré | Basse | 0.5j |
| Pas de TypeScript backend | Moyenne | 2j |

### 2.4 Fiabilité

**Objectif** : L'application fonctionne sans interruption.

| Indicateur | Description | Mesure | Cible | Actuel |
|------------|-------------|--------|-------|--------|
| **Disponibilité** | Uptime de l'application | % | > 99% | ~99% ✅ |
| **MTBF** | Temps moyen entre pannes | heures | > 720h | N/A |
| **MTTR** | Temps moyen de récupération | minutes | < 30min | ~15min ✅ |
| **Taux d'erreur** | Requêtes en erreur | % | < 1% | < 0.5% ✅ |

**SLA Azure** :
- App Service : 99.95%
- PostgreSQL Flexible : 99.99%
- Static Web Apps : 99.95%

## 3. Axes d'Amélioration

### Priorité Haute (Dette technique critique)

| Axe | Impact | Action | Effort |
|-----|--------|--------|--------|
| **Tests unitaires** | Maintenabilité | Écrire tests Vitest | 2 jours |
| **Validation entrées** | Sécurité | Implémenter Zod | 0.5 jour |
| **Middleware JWT** | Sécurité | Protéger routes | 0.5 jour |

### Priorité Moyenne

| Axe | Impact | Action | Effort |
|-----|--------|--------|--------|
| Refactoring backend | Maintenabilité | Séparer routes/controllers | 1 jour |
| ESLint/Prettier | Maintenabilité | Configurer linting | 0.5 jour |
| Rate limiting | Sécurité | Implémenter express-rate-limit | 0.5 jour |

### Priorité Basse

| Axe | Impact | Action | Effort |
|-----|--------|--------|--------|
| TypeScript backend | Maintenabilité | Migrer index.js | 2 jours |
| Tests E2E | Fiabilité | Implémenter Playwright | 2 jours |
| Monitoring | Fiabilité | Configurer alertes Azure | 1 jour |

## 4. Tableau de Bord

```
┌────────────────────────────────────────────────────────────┐
│                 QUALITÉ PETITEMAISON                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  FONCTIONNALITÉ    ████████████████████  100%  ✅          │
│                                                             │
│  PERFORMANCE       ████████████████░░░░   80%  ✅          │
│                                                             │
│  MAINTENABILITÉ    ████████░░░░░░░░░░░░   40%  ⚠️          │
│                                                             │
│  FIABILITÉ         ██████████████████░░   90%  ✅          │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  SCORE GLOBAL:     78/100  (B)                              │
└────────────────────────────────────────────────────────────┘
```

## 5. Suivi et Mesure

### Outils de Mesure

| Indicateur | Outil | Fréquence |
|------------|-------|-----------|
| Couverture tests | Vitest coverage | Chaque PR |
| Performance API | Azure Application Insights | Temps réel |
| Disponibilité | Azure Monitor | Temps réel |
| Dette technique | Revue manuelle | Mensuelle |

### Revue des Indicateurs

- **Hebdomadaire** : Vérification disponibilité et erreurs
- **Sprint** : Revue performance et dette technique
- **Mensuelle** : Mise à jour tableau de bord complet
