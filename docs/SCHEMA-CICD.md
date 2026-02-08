# Schéma CI/CD - PETITEMAISON

## 1. Vue d'Ensemble du Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DÉVELOPPEUR                                     │
│                                   │                                          │
│                            git push / PR                                     │
│                                   ▼                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GITHUB REPOSITORY                                  │
│                          (main / feature branches)                           │
│                                   │                                          │
│                    ┌──────────────┴──────────────┐                          │
│                    ▼                             ▼                          │
│              Push/PR (any)                  Push (main only)                │
└────────────────────┼─────────────────────────────┼──────────────────────────┘
                     │                             │
                     ▼                             ▼
┌────────────────────────────────┐  ┌────────────────────────────────────────┐
│      CI PIPELINE (ci.yml)      │  │         CD PIPELINES                    │
│                                │  │                                         │
│  ┌──────────────────────────┐  │  │  ┌─────────────────────────────────┐   │
│  │    Backend Job           │  │  │  │  cd-backend.yml                 │   │
│  │    ─────────────         │  │  │  │  ───────────────                │   │
│  │    1. Checkout           │  │  │  │  1. Checkout                    │   │
│  │    2. Setup Node 20      │  │  │  │  2. Setup Node 20               │   │
│  │    3. Setup PostgreSQL   │  │  │  │  3. npm ci --omit=dev           │   │
│  │    4. npm ci             │  │  │  │  4. Create ZIP                  │   │
│  │    5. Apply schema.sql   │  │  │  │  5. Deploy to Azure App Service │   │
│  │    6. Start server       │  │  │  └─────────────────────────────────┘   │
│  │    7. Smoke test /       │  │  │                                         │
│  │    8. Smoke test /products│  │  │  ┌─────────────────────────────────┐   │
│  └──────────────────────────┘  │  │  │  deploy-frontend.yml            │   │
│                                │  │  │  ───────────────────             │   │
│  ┌──────────────────────────┐  │  │  │  1. Checkout                    │   │
│  │    Frontend Job          │  │  │  │  2. Setup Node 20               │   │
│  │    ────────────          │  │  │  │  3. npm ci                      │   │
│  │    1. Checkout           │  │  │  │  4. npm run build               │   │
│  │    2. Setup Node 20      │  │  │  │     (avec VITE_API_URL)         │   │
│  │    3. npm ci             │  │  │  │  5. Deploy to Static Web Apps   │   │
│  │    4. npm run build      │  │  │  └─────────────────────────────────┘   │
│  │       (TypeScript check) │  │  │                                         │
│  └──────────────────────────┘  │  │                                         │
└────────────────────────────────┘  └─────────────────────────────────────────┘
                     │                             │
                     ▼                             ▼
              ┌──────────┐              ┌────────────────────┐
              │  ✅ Pass │              │  AZURE DEPLOYMENT  │
              │  ❌ Fail │              └────────────────────┘
              └──────────┘                         │
                                    ┌──────────────┴──────────────┐
                                    ▼                             ▼
                        ┌───────────────────┐         ┌───────────────────┐
                        │ Azure App Service │         │ Azure Static Web  │
                        │    (Backend)      │         │    Apps (Frontend)│
                        │                   │         │                   │
                        │ petitemaison-     │         │ white-plant-      │
                        │ backend-xxx       │         │ 07862941e         │
                        └─────────┬─────────┘         └───────────────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ Azure PostgreSQL  │
                        │ Flexible Server   │
                        │                   │
                        │ petitemaison-pg01 │
                        └───────────────────┘
```

## 2. Détail des Workflows

### 2.1 CI Pipeline (ci.yml)

**Déclencheur** : Push ou Pull Request sur toutes les branches

```yaml
Triggers:
  - push (all branches)
  - pull_request (all branches)

Jobs:
  ┌─────────────────────────────────────────────────────────────┐
  │ backend:                                                     │
  │   runs-on: ubuntu-latest                                    │
  │   services:                                                 │
  │     postgres:                                               │
  │       image: postgres:16                                    │
  │       env: POSTGRES_PASSWORD=postgres                       │
  │       ports: 5432:5432                                      │
  │                                                             │
  │   steps:                                                    │
  │     ├─ actions/checkout@v4                                  │
  │     ├─ actions/setup-node@v4 (node: 20)                    │
  │     ├─ npm ci (Backend/)                                    │
  │     ├─ Create database petitemaison_test                    │
  │     ├─ Apply Backend/db/schema.sql                          │
  │     ├─ Start server (background)                            │
  │     ├─ Wait 5 seconds                                       │
  │     └─ curl -f http://localhost:5000/products              │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ frontend:                                                    │
  │   runs-on: ubuntu-latest                                    │
  │                                                             │
  │   steps:                                                    │
  │     ├─ actions/checkout@v4                                  │
  │     ├─ actions/setup-node@v4 (node: 20)                    │
  │     ├─ npm ci (frontend/)                                   │
  │     └─ npm run build                                        │
  │        (includes TypeScript compilation)                    │
  └─────────────────────────────────────────────────────────────┘
```

### 2.2 CD Backend (cd-backend.yml)

**Déclencheur** : Push sur branche `main` uniquement

```yaml
Trigger: push to main

  ┌─────────────────────────────────────────────────────────────┐
  │ deploy:                                                      │
  │   runs-on: ubuntu-latest                                    │
  │                                                             │
  │   steps:                                                    │
  │     ├─ actions/checkout@v4                                  │
  │     ├─ actions/setup-node@v4 (node: 20)                    │
  │     ├─ npm ci --omit=dev (Backend/)                        │
  │     │    └─ Only production dependencies                    │
  │     ├─ zip -r backend.zip (exclude .git, .env)             │
  │     └─ Azure/webapps-deploy@v3                             │
  │          ├─ app-name: petitemaison-backend                 │
  │          ├─ publish-profile: ${{ secrets.AZURE_... }}      │
  │          └─ package: backend.zip                           │
  └─────────────────────────────────────────────────────────────┘
```

### 2.3 CD Frontend (deploy-frontend.yml)

**Déclencheur** : Push sur branche `main` uniquement

```yaml
Trigger: push to main

env:
  VITE_API_URL: https://petitemaison-backend-xxx.azurewebsites.net

  ┌─────────────────────────────────────────────────────────────┐
  │ deploy:                                                      │
  │   runs-on: ubuntu-latest                                    │
  │                                                             │
  │   steps:                                                    │
  │     ├─ actions/checkout@v4                                  │
  │     ├─ actions/setup-node@v4 (node: 20)                    │
  │     ├─ npm ci (frontend/)                                   │
  │     ├─ npm run build                                        │
  │     │    └─ VITE_API_URL injected at build time            │
  │     └─ Azure/static-web-apps-deploy@v1                     │
  │          ├─ azure_static_web_apps_api_token: ${{...}}      │
  │          ├─ action: upload                                  │
  │          ├─ app_location: frontend/dist                    │
  │          └─ skip_app_build: true                           │
  └─────────────────────────────────────────────────────────────┘
```

## 3. Secrets Requis

| Secret | Utilisé par | Description |
|--------|-------------|-------------|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | cd-backend.yml | Profil XML de publication Azure App Service |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_WHITE_PLANT_07862941E` | deploy-frontend.yml | Token de déploiement Static Web Apps |

## 4. Variables d'Environnement

### Build Time (CI/CD)

| Variable | Workflow | Valeur |
|----------|----------|--------|
| `VITE_API_URL` | deploy-frontend.yml | URL du backend Azure |

### Runtime (Azure)

| Variable | Service | Description |
|----------|---------|-------------|
| `DB_HOST` | App Service | Host PostgreSQL |
| `DB_NAME` | App Service | Nom base de données |
| `DB_USER` | App Service | Utilisateur PostgreSQL |
| `DB_PASSWORD` | App Service | Mot de passe PostgreSQL |
| `DB_PORT` | App Service | Port (5432) |
| `NODE_ENV` | App Service | `production` |
| `JWT_SECRET` | App Service | Secret pour tokens |
| `FRONTEND_URL` | App Service | URL frontend (CORS) |

## 5. Flux de Déploiement

```
Developer                GitHub                    Azure
    │                       │                        │
    │ git push main         │                        │
    │──────────────────────>│                        │
    │                       │                        │
    │                       │ Trigger CI             │
    │                       │ ───────────────>       │
    │                       │ Backend tests ✅       │
    │                       │ Frontend build ✅      │
    │                       │                        │
    │                       │ Trigger CD Backend     │
    │                       │───────────────────────>│
    │                       │                        │ Deploy App Service
    │                       │                        │ Restart
    │                       │                        │
    │                       │ Trigger CD Frontend    │
    │                       │───────────────────────>│
    │                       │                        │ Deploy Static Web App
    │                       │                        │
    │                       │<───────────────────────│
    │                       │ Deployment complete    │
    │<──────────────────────│                        │
    │ GitHub Actions ✅      │                        │
    │                       │                        │
    │ Test https://...      │                        │
    │──────────────────────────────────────────────>│
    │                       │                        │ Serve application
    │<─────────────────────────────────────────────│
    │ Application OK        │                        │
```

## 6. Temps d'Exécution

| Étape | Durée moyenne |
|-------|---------------|
| CI Backend | ~57s |
| CI Frontend | ~16s |
| CD Backend | ~31s |
| CD Frontend | ~51s |
| **Total (parallèle)** | **~2 minutes** |

## 7. Points d'Amélioration

| Amélioration | Impact | Effort |
|--------------|--------|--------|
| Ajouter tests unitaires dans CI | Qualité | Moyen |
| Ajouter npm audit | Sécurité | Faible |
| Ajouter cache node_modules | Performance | Faible |
| Ajouter environnement staging | Fiabilité | Élevé |
| Ajouter health check post-deploy | Fiabilité | Faible |
