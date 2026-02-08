# PETITEMAISON - Récapitulatif Déploiement Azure

## Accès Application

### URLs de Production

| Service | URL |
|---------|-----|
| **Frontend** | https://white-plant-07862941e.6.azurestaticapps.net |
| **Backend API** | https://petitemaison-backend-gxe2erdqasb9bkd2.francecentral-01.azurewebsites.net |

### Compte Test

| Champ | Valeur |
|-------|--------|
| **Nom** | Test User |
| **Email** | test@test.com |
| **Mot de passe** | Test1234! |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                    (CI/CD via GitHub Actions)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Azure Static Web App  │   │    Azure App Service    │
│       (Frontend)        │   │       (Backend)         │
│                         │   │                         │
│  - React 19 + Vite      │──▶│  - Node.js 20 + Express │
│  - TanStack Router      │   │  - API REST             │
│  - Tailwind CSS         │   │  - JWT Auth             │
└─────────────────────────┘   └───────────┬─────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │  Azure PostgreSQL       │
                              │  Flexible Server        │
                              │                         │
                              │  - PostgreSQL 16        │
                              │  - SSL activé           │
                              └─────────────────────────┘
```

---

## Ressources Azure

| Ressource | Type | Région | Rôle |
|-----------|------|--------|------|
| `rg-petitemaison` | Static Web App | West US 2 | Frontend React |
| `petitemaison-backend` | App Service | France Central | API Express |
| `petitemaison-pg01` | PostgreSQL Flexible Server | France Central | Base de données |
| `ASP-rgpetitemaison-9320` | App Service Plan | France Central | Plan d'hébergement backend |

---

## Configuration Backend (Variables d'environnement)

Les variables sont configurées dans **Azure Portal** → `petitemaison-backend` → **Variables d'environnement** :

| Variable | Valeur |
|----------|--------|
| `DB_HOST` | `petitemaison-pg01.postgres.database.azure.com` |
| `DB_NAME` | `petitemaison` |
| `DB_USER` | `petitemaison_admin` |
| `DB_PASSWORD` | `Test1234!` |
| `DB_PORT` | `5432` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `petitemaison_secret_2026` |
| `FRONTEND_URL` | `https://white-plant-07862941e.6.azurestaticapps.net` |

---

## CI/CD (GitHub Actions)

### Workflows

| Fichier | Déclencheur | Action |
|---------|-------------|--------|
| `.github/workflows/ci.yml` | Push/PR sur toutes branches | Tests : build frontend + smoke test backend |
| `.github/workflows/cd-backend.yml` | Push sur `main` | Déploie backend vers Azure App Service |
| `.github/workflows/deploy-frontend.yml` | Push sur `main` | Déploie frontend vers Azure Static Web Apps |

### Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Profil de publication du backend (téléchargé depuis Azure) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_WHITE_PLANT_07862941E` | Token de déploiement Static Web App |

### Processus de déploiement

1. Push sur `main`
2. GitHub Actions déclenche les workflows
3. CI vérifie le build
4. CD déploie automatiquement backend et frontend
5. Application mise à jour en ~2 minutes

---

## Base de données

### Connexion

```
Host: petitemaison-pg01.postgres.database.azure.com
Port: 5432
Database: petitemaison
User: petitemaison_admin
Password: Test1234!
SSL: Requis
```

### Tables

**utilisateurs**
```sql
CREATE TABLE public.utilisateurs (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**produits**
```sql
CREATE TABLE public.produits (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  categorie VARCHAR(100),
  prix NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Accès via Cloud Shell

1. Azure Portal → Icône `>_` en haut à droite
2. Choisir **Bash**
3. Exécuter :
```bash
export PGHOST=petitemaison-pg01.postgres.database.azure.com
export PGUSER=petitemaison_admin
export PGPORT=5432
export PGDATABASE=petitemaison
export PGPASSWORD="Test1234!"
psql
```

---

## API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Health check | Non |
| GET | `/users` | Liste utilisateurs | Non |
| POST | `/auth/register` | Inscription | Non |
| POST | `/auth/login` | Connexion (retourne JWT) | Non |
| GET | `/products` | Liste produits | Non |
| GET | `/products?search=xxx` | Recherche produits | Non |
| GET | `/products?category=xxx` | Filtre par catégorie | Non |

---

## Dépannage

### Erreur CORS
- Vérifier `FRONTEND_URL` dans les variables d'environnement du backend
- L'URL doit correspondre exactement au domaine du frontend (sans `/` final)
- Redémarrer le backend après modification

### Erreur 500 sur les endpoints
- Vérifier les variables DB_* dans le backend
- Vérifier que le firewall PostgreSQL autorise les services Azure
- Tester la connexion via Cloud Shell

### Erreur de connexion (401)
- Le mot de passe est hashé avec bcrypt
- Créer les utilisateurs via l'inscription sur le site (pas en SQL direct)

### Voir les logs
1. Azure Portal → `petitemaison-backend`
2. Supervision → Flux de journaux (Log Stream)

---

## Coûts estimés (Crédits étudiants)

| Service | Coût mensuel |
|---------|--------------|
| Static Web App | Gratuit |
| App Service (B1) | ~13€ |
| PostgreSQL Flexible (B1ms) | ~15€ |
| **Total** | ~28€/mois |

*Couvert par les $100 de crédits Azure for Students*

---

## Fichiers modifiés pour le déploiement

| Fichier | Modification |
|---------|--------------|
| `.github/workflows/deploy-frontend.yml` | Ajout `VITE_API_URL` avec URL backend Azure |
| `.github/workflows/cd-backend.yml` | Configuration déploiement Azure App Service |

---

## Checklist déploiement futur

- [ ] Secrets GitHub configurés
- [ ] Variables d'environnement backend configurées
- [ ] Firewall PostgreSQL : "Autoriser services Azure" activé
- [ ] Base de données créée avec tables
- [ ] FRONTEND_URL configurée pour CORS
- [ ] Push sur main → déploiement automatique
