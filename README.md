# Petite Maison

Application web e-commerce pour la gestion de produits.

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 + TypeScript | Node.js + Express 5 |
| Vite, Tailwind CSS, Bootstrap | PostgreSQL |
| TanStack Router | JWT Authentication |

## Installation

### Backend
```bash
cd Backend
npm install
# Configurer .env (voir .env.example)
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement

### Backend (.env)
```
PORT=5000
DB_USER=xxx
DB_PASSWORD=xxx
DB_HOST=localhost
DB_PORT=5432
DB_NAME=petitemaison
JWT_SECRET=xxx
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le frontend en dev |
| `npm run build` | Build de production |
| `npm start` | Lancer le backend |
