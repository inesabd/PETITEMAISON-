# Plan de Remédiation Sécurité - PETITEMAISON

## 1. Synthèse des Risques

| Niveau | Nombre | Action | Corrigés |
|--------|--------|--------|----------|
| 🔴 Critique | 2 | Correction immédiate | 1/2 (RC-02 ✅) |
| 🟠 Élevé | 3 | Correction sous 1 semaine | 2/3 (RE-01 ✅, RE-02 ✅) |
| 🟡 Moyen | 4 | Correction sous 1 mois | 0/4 |
| 🟢 Faible | 2 | Backlog | 0/2 |

## 2. Risques Identifiés et Priorisation

### 🔴 Risques Critiques

#### RC-01 : Absence de validation des entrées

| Attribut | Valeur |
|----------|--------|
| **Risque** | Injection de données malformées, XSS potentiel |
| **Impact** | Élevé - Compromission données |
| **Probabilité** | Élevée - Endpoints publics |
| **Localisation** | Backend/index.js (lignes 103-136 register, 143-191 login) |
| **Status** | ⚠️ Partiellement mitigé (vérification de présence), validation Zod à implémenter |

**Vulnérabilité** :
```javascript
// Actuel - Pas de validation
const { username, email, password } = req.body
if (!username || !email || !password) { ... }
// Accepte n'importe quelle valeur si présente
```

**Remédiation** :
```javascript
// Avec Zod
const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/)
})

const { username, email, password } = registerSchema.parse(req.body)
```

**Effort** : 0.5 jour

---

#### RC-02 : Routes sensibles non protégées

| Attribut | Valeur |
|----------|--------|
| **Risque** | Accès non autorisé aux données utilisateurs |
| **Impact** | Élevé - Fuite de données personnelles |
| **Probabilité** | Élevée - Endpoint public |
| **Localisation** | Backend/index.js (lignes 66-79, 87-97) |
| **Status** | ✅ **CORRIGÉ** |

**Vulnérabilité initiale** :
```javascript
// AVANT: /users accessible sans authentification, expose password_hash
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM public.utilisateurs')
  res.json(result.rows) // Expose password_hash !
})
```

**Correction appliquée** (Backend/index.js) :
```javascript
// APRÈS: Middleware JWT + exclusion password_hash
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requis' })
  }
  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(403).json({ message: 'Token invalide ou expiré' })
  }
}

app.get('/users', authenticateJWT, async (req, res) => {
  const result = await pool.query(
    'SELECT id, nom, email, created_at FROM public.utilisateurs'
  )
  res.json(result.rows)
})
```

---

### 🟠 Risques Élevés

#### RE-01 : Absence de rate limiting

| Attribut | Valeur |
|----------|--------|
| **Risque** | Brute force sur authentification |
| **Impact** | Moyen - Compromission comptes |
| **Probabilité** | Moyenne |
| **Localisation** | Backend/index.js (lignes 36-48, 103, 143) |
| **Status** | ✅ **CORRIGÉ** |

**Correction appliquée** (Backend/index.js) :
```javascript
// Rate limiting global (100 req/15min par IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes, réessayez plus tard' },
})
app.use(globalLimiter)

// Rate limiting strict sur authentification (10 req/15min par IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
})

app.post('/auth/register', authLimiter, async (req, res) => { ... })
app.post('/auth/login', authLimiter, async (req, res) => { ... })
```

---

#### RE-02 : Headers de sécurité manquants

| Attribut | Valeur |
|----------|--------|
| **Risque** | XSS, Clickjacking, Sniffing |
| **Impact** | Moyen |
| **Probabilité** | Moyenne |
| **Localisation** | Backend/index.js (ligne 14) |
| **Status** | ✅ **CORRIGÉ** |

**Correction appliquée** (Backend/index.js) :
```javascript
const helmet = require('helmet')
app.use(helmet())
```

**Headers ajoutés par Helmet.js** :
- Content-Security-Policy
- X-Frame-Options (anti-clickjacking)
- X-Content-Type-Options (anti-MIME sniffing)
- Strict-Transport-Security (force HTTPS)
- X-XSS-Protection

---

#### RE-03 : Logs avec informations sensibles

| Attribut | Valeur |
|----------|--------|
| **Risque** | Exposition d'informations en cas de fuite logs |
| **Impact** | Moyen |
| **Probabilité** | Faible |
| **Localisation** | Backend/index.js (lignes 94, 133, 188, 229) |
| **Status** | ❌ Non corrigé |

**Vulnérabilité** :
```javascript
console.error('REGISTER error:', err) // Stack trace complet
```

**Remédiation** :
```javascript
const winston = require('winston')
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
})

// Utilisation
logger.error('Register failed', { email, errorCode: err.code })
```

**Effort** : 2 heures

---

### 🟡 Risques Moyens

#### RM-01 : JWT Secret faible

| Attribut | Valeur |
|----------|--------|
| **Risque** | Forgery de tokens |
| **Localisation** | Configuration Azure |
| **Status** | ⚠️ À améliorer |

**Remédiation** : Générer un secret de 256 bits :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

#### RM-02 : Pas de refresh token

| Attribut | Valeur |
|----------|--------|
| **Risque** | UX dégradée, tokens longue durée |
| **Status** | ⚠️ Backlog |

---

#### RM-03 : Stockage token localStorage

| Attribut | Valeur |
|----------|--------|
| **Risque** | Vol de token via XSS |
| **Status** | ⚠️ Backlog |

**Remédiation future** : HttpOnly cookies

---

#### RM-04 : Pas de CSRF protection

| Attribut | Valeur |
|----------|--------|
| **Risque** | Requêtes forgées cross-site |
| **Status** | ⚠️ Backlog |

---

### 🟢 Risques Faibles

#### RF-01 : Messages d'erreur informatifs

Messages d'erreur pourraient révéler des informations sur la structure.

#### RF-02 : Pas de blocage après échecs répétés

Comptes non verrouillés après multiples échecs.

---

## 3. Bonnes Pratiques Implémentées ✅

| # | Pratique | Description | Localisation |
|---|----------|-------------|--------------|
| 1 | **Hashage bcrypt** | Mots de passe hashés avec salt (10 rounds) | Backend/index.js:121 |
| 2 | **JWT stateless** | Authentification sans session serveur, expiration 2h | Backend/index.js:177-181 |
| 3 | **SQL paramétré** | Protection injection SQL (`$1`, `$2`) | Tous les `pool.query()` |
| 4 | **CORS whitelist** | Seules les origines autorisées peuvent accéder à l'API | Backend/index.js:17-33 |
| 5 | **SSL PostgreSQL** | Connexion chiffrée en production | Backend/index.js:59-62 |
| 6 | **Helmet.js** | Headers de sécurité HTTP (CSP, HSTS, X-Frame-Options) | Backend/index.js:14 |
| 7 | **Rate limiting global** | 100 requêtes/15min par IP | Backend/index.js:36-41 |
| 8 | **Rate limiting auth** | 10 tentatives/15min sur login/register | Backend/index.js:44-48, 103, 143 |
| 9 | **Middleware JWT** | Routes sensibles protégées par vérification token | Backend/index.js:66-79 |
| 10 | **Exclusion password_hash** | Données sensibles exclues des réponses API | Backend/index.js:90 |
| 11 | **Variables env** | Secrets hors du code source | .env + Azure App Settings |
| 12 | **HTTPS forcé** | TLS géré par Azure sur tous les services | Infrastructure Azure |

---

## 4. Plan d'Action Priorisé

### Phase 1 : Corrections Critiques (Semaine 1)

| Action | Effort | Responsable | Status |
|--------|--------|-------------|--------|
| Implémenter validation Zod | 4h | Dev | ⬜ À faire |
| Ajouter middleware JWT | 4h | Dev | ✅ Fait |
| Protéger route /users | 1h | Dev | ✅ Fait |
| Retirer password_hash des réponses | 1h | Dev | ✅ Fait |

### Phase 2 : Corrections Élevées (Semaine 2)

| Action | Effort | Responsable | Status |
|--------|--------|-------------|--------|
| Installer express-rate-limit | 2h | Dev | ✅ Fait |
| Installer Helmet.js | 1h | Dev | ✅ Fait |
| Configurer Winston logger | 2h | Dev | ⬜ À faire |
| Régénérer JWT_SECRET (256 bits) | 0.5h | Dev | ⬜ À faire |

### Phase 3 : Améliorations (Mois 1)

| Action | Effort | Responsable | Status |
|--------|--------|-------------|--------|
| Audit npm dependencies | 1h | Dev | ⬜ |
| Ajouter npm audit dans CI | 1h | Dev | ⬜ |
| Documenter politique sécurité | 2h | Dev | ⬜ |

---

## 5. Checklist de Vérification

### Avant chaque déploiement

- [ ] Pas de secrets dans le code
- [ ] npm audit sans vulnérabilités critiques
- [ ] Tests de sécurité passent
- [ ] Variables d'environnement configurées

### Revue mensuelle

- [ ] Mise à jour des dépendances
- [ ] Revue des logs d'erreurs
- [ ] Vérification des accès Azure
- [ ] Rotation des secrets (si nécessaire)

---

## 6. Ressources

| Ressource | URL |
|-----------|-----|
| OWASP Top 10 | https://owasp.org/Top10/ |
| Express Security | https://expressjs.com/en/advanced/best-practice-security.html |
| Node.js Security | https://nodejs.org/en/docs/guides/security/ |
| Helmet.js | https://helmetjs.github.io/ |
