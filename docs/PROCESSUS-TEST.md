# Processus de Test - PETITEMAISON

## 1. Strategie de Test

### Pyramide des Tests

```
                    /\
                   /  \
                  / E2E\         Smoke tests (CI)
                 /------\
                /        \
               /Integration\    8 tests - API endpoints Backend
              /------------\
             /              \
            /  Unit Tests    \  13 tests - Logique metier Frontend
           /------------------\
```

### Types de Tests Appliques au POC

| Type | Nombre | Description | Outil | Status |
|------|--------|-------------|-------|--------|
| **Unitaires** | 13 | Logique metier frontend (CartContext, API auth) | Vitest + Testing Library | ✅ Actif |
| **Integration** | 8 | Endpoints API backend (auth, produits, securite) | Vitest + Supertest | ✅ Actif |
| **Smoke** | 1 | Verification deploiement (`GET /products`) | curl (CI) | ✅ Actif |
| **Build** | 2 | Compilation TypeScript + build Vite | tsc + vite build (CI) | ✅ Actif |

**Total : 21 tests automatises executes avec succes + 3 verifications CI.**

---

## 2. Outils de Test

### Frontend

| Outil | Version | Role |
|-------|---------|------|
| **Vitest** | 3.0.5 | Framework de test (compatible Vite) |
| **@testing-library/react** | 16.2.0 | Utilitaires de test React (renderHook, act) |
| **@testing-library/jest-dom** | 6.9.1 | Matchers DOM (toBeInTheDocument, etc.) |
| **jsdom** | 27.0.0 | Environnement DOM simule pour Node.js |

### Backend

| Outil | Version | Role |
|-------|---------|------|
| **Vitest** | 4.0.18 | Framework de test |
| **Supertest** | 7.2.2 | Tests HTTP sans demarrer le serveur |

### CI/CD

| Outil | Role |
|-------|------|
| **GitHub Actions** | Execution automatisee a chaque push/PR |
| **PostgreSQL 16 Service** | Base de donnees de test en CI |

---

## 3. Tests Implementes - Detail

### 3.1 Tests Unitaires Frontend (13 tests)

**Fichier** : `frontend/src/__tests__/cart.test.tsx` - **8 tests**

Teste le hook `useCart` du `CartContext` (logique metier du panier) :

| # | Test | Verifie |
|---|------|---------|
| 1 | Initialise avec un panier vide | `items = []`, `totalItems = 0`, `totalPrice = 0` |
| 2 | Ajoute un produit au panier | `items.length = 1`, `quantity = 1`, `totalPrice = 89` |
| 3 | Incremente la quantite si produit existant | `items.length = 1`, `quantity = 2`, `totalPrice = 178` |
| 4 | Calcule le total avec plusieurs produits | `totalItems = 2`, `totalPrice = 134` (89 + 45) |
| 5 | Supprime un produit du panier | `items.length = 1`, produit restant correct |
| 6 | Vide le panier completement | `items = []`, tous totaux a 0 |
| 7 | Met a jour la quantite d'un produit | `quantity = 5`, `totalPrice = 445` (89 x 5) |
| 8 | Supprime un produit si quantite passe a 0 | `items.length = 0` |

```typescript
// Extrait reel du test (cart.test.tsx)
it('ajoute un produit au panier', () => {
  const { result } = renderHook(() => useCart(), { wrapper })

  act(() => {
    result.current.addItem(mockProduct)
  })

  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].titre).toBe('Figurine Evil Ed')
  expect(result.current.items[0].quantity).toBe(1)
  expect(result.current.totalPrice).toBe(89)
})
```

**Fichier** : `frontend/src/__tests__/auth-api.test.ts` - **5 tests**

Teste les fonctions `login()` et `register()` de `src/api/auth.ts` avec mock de `fetch` :

| # | Test | Verifie |
|---|------|---------|
| 1 | Login reussi | Retourne `{ token, user }`, appel fetch correct |
| 2 | Login echec (mauvais identifiants) | Leve erreur "Email ou mot de passe incorrect" |
| 3 | Login echec (erreur serveur) | Leve erreur generique "Erreur login" |
| 4 | Register reussi | Retourne `{ user }`, appel fetch correct |
| 5 | Register echec (email deja utilise) | Leve erreur "Email deja utilise" |

```typescript
// Extrait reel du test (auth-api.test.ts)
it('retourne token et user si login reussit', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  })

  const result = await login({ email: 'test@test.com', password: 'Test1234!' })

  expect(result).toEqual(mockResponse)
  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining('/auth/login'),
    expect.objectContaining({ method: 'POST' }),
  )
})
```

### 3.2 Tests d'Integration Backend (8 tests)

**Fichier** : `Backend/__tests__/api.test.js`

Teste les endpoints API reels avec Supertest (requetes HTTP sans demarrer le serveur) :

| # | Test | Endpoint | Verifie |
|---|------|----------|---------|
| 1 | Health check OK | `GET /` | Status 200, body contient "Backend OK" |
| 2 | Route protegee sans token | `GET /users` | Status 401, message "Token requis" |
| 3 | Route protegee avec token invalide | `GET /users` | Status 403, message "Token invalide ou expire" |
| 4 | Login sans champs | `POST /auth/login` | Status 400, message "Champs manquants" |
| 5 | Login sans mot de passe | `POST /auth/login` | Status 400, message "Champs manquants" |
| 6 | Register sans champs | `POST /auth/register` | Status 400, message "Champs manquants" |
| 7 | Register sans email | `POST /auth/register` | Status 400, message "Champs manquants" |
| 8 | Headers Helmet presents | `GET /` | `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN` |

```javascript
// Extrait reel du test (api.test.js)
describe('GET /users - Route protegee', () => {
  it('retourne 401 sans token JWT', async () => {
    const res = await request(app).get('/users')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token requis')
  })

  it('retourne 403 avec un token invalide', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer fake-token-123')

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Token invalide ou expire')
  })
})
```

### 3.3 Tests Smoke (CI)

Executes dans le pipeline CI apres demarrage du backend :

```yaml
# .github/workflows/ci.yml
- name: Smoke test /products
  run: curl -f http://localhost:5000/products
```

Verifie que le backend demarre correctement et que l'endpoint principal repond.

---

## 4. Execution des Tests

### Commandes

```bash
# Frontend - executer tous les tests (13 tests)
cd frontend
npm run test          # alias: npx vitest run

# Backend - executer tous les tests (8 tests)
cd Backend
npm test              # alias: npx vitest run
```

### Resultats d'Execution

**Frontend** (13 tests) :

```
 ✓ src/__tests__/cart.test.tsx (8 tests)
 ✓ src/__tests__/auth-api.test.ts (5 tests)

 Test Files  2 passed (2)
      Tests  13 passed (13)
```

**Backend** (8 tests) :

```
 ✓ __tests__/api.test.js (8 tests)

 Test Files  1 passed (1)
      Tests  8 passed (8)
```

### Pipeline CI Complet

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌──────────────┐    ┌────────────┐
│ Checkout  │───>│  Install  │───>│ Apply DB  │───>│ Integration  │───>│ Smoke Test │
│           │    │   deps    │    │  schema   │    │   Tests (8)  │    │  curl /    │
└───────────┘    └───────────┘    └───────────┘    └──────────────┘    └────────────┘
                                                   npx vitest run      curl -f ...

┌───────────┐    ┌───────────┐    ┌──────────────┐    ┌───────────┐
│ Checkout  │───>│  Install  │───>│ Unit Tests   │───>│   Build   │
│           │    │   deps    │    │    (13)      │    │ vite+tsc  │
└───────────┘    └───────────┘    └──────────────┘    └───────────┘
                                   npx vitest run     npm run build
```

Extrait du fichier `.github/workflows/ci.yml` :

```yaml
# Backend job
- name: Run backend integration tests
  working-directory: Backend
  run: NODE_ENV=test npx vitest run

# Frontend job
- name: Run unit tests
  working-directory: frontend
  run: npx vitest run

- name: Build
  working-directory: frontend
  run: npm run build
```

---

## 5. Parties Prenantes

| Role | Responsabilite | Tests concernes |
|------|----------------|-----------------|
| **Developpeur** | Ecrire et maintenir les tests, executer localement avant push | Unitaires, Integration |
| **CI/CD (GitHub Actions)** | Execution automatique a chaque push et pull request | Tous (unitaires, integration, smoke, build) |
| **Responsable QA** | Validation des resultats, revue des cas de test | Tous |
| **Chef de projet** | S'assurer que les criteres de qualite sont respectes | Rapport global |

---

## 6. Criteres de Qualite

| Critere | Seuil | Etat actuel |
|---------|-------|-------------|
| Tests passants | 100% | ✅ 21/21 (100%) |
| Tests automatises en CI | Oui | ✅ GitHub Actions |
| Temps d'execution | < 5 minutes | ✅ ~15 secondes |
| Tests flaky (instables) | 0 | ✅ 0 |
| Types de tests couverts | >= 2 | ✅ 3 types (unitaire, integration, smoke) |

### Definition of Done (incluant tests)

- [x] Code implemente et fonctionnel
- [x] Tests unitaires ecrits (CartContext, API auth)
- [x] Tests d'integration ecrits (endpoints API)
- [x] Tous les tests passent (21/21)
- [x] CI pipeline vert (tests executes automatiquement)

---

## 7. Rapport de Tests

### Synthese

| Type | Fichier | Nombre | Passants | Echecs |
|------|---------|--------|----------|--------|
| Unitaire (Frontend) | `cart.test.tsx` | 8 | 8 | 0 |
| Unitaire (Frontend) | `auth-api.test.ts` | 5 | 5 | 0 |
| Integration (Backend) | `api.test.js` | 8 | 8 | 0 |
| Smoke (CI) | `ci.yml` | 1 | 1 | 0 |
| Build (CI) | `ci.yml` | 2 | 2 | 0 |
| **TOTAL** | | **24** | **24** | **0** |

### Couverture Fonctionnelle

| Module | Fonctionnalites testees |
|--------|------------------------|
| **Panier (CartContext)** | Ajout, suppression, modification quantite, calcul totaux, vidage |
| **API Auth (login)** | Succes, echec identifiants, erreur serveur |
| **API Auth (register)** | Succes, email deja utilise |
| **Endpoints Backend** | Health check, protection JWT (401/403), validation champs, headers securite |

---

## 8. Configuration Technique

### Frontend (`vite.config.ts`)

```typescript
test: {
  environment: 'jsdom',     // Simule le DOM dans Node.js
  globals: true,             // describe, it, expect globaux
  setupFiles: ['./src/__tests__/setup.ts'],  // Mock localStorage
},
```

### Backend (`package.json`)

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "supertest": "^7.2.2",
    "vitest": "^4.0.18"
  }
}
```

### Setup de Test (`frontend/src/__tests__/setup.ts`)

```typescript
import '@testing-library/jest-dom'

// Mock localStorage pour simuler le stockage navigateur
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
```

---

## 9. Ameliorations Possibles

| Amelioration | Type | Priorite |
|-------------|------|----------|
| Tests E2E avec Playwright (parcours utilisateur complet) | End-to-end | Moyenne |
| Couverture de code (`vitest --coverage`) | Metriques | Moyenne |
| Tests de performance (temps de reponse API < 200ms) | Performance | Basse |
| Tests de non-regression automatises | Non-regression | Basse |
