const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Connexion à PostgreSQL
const pool = new Pool({
  user: 'postgres',              // ton utilisateur PostgreSQL
  host: 'localhost',
  database: 'ma_petitemaison',   // nom de ta base
  password: process.env.DB_PASSWORD || 'ines0310',  // Utilise une variable d'environnement
  port: 5432,
});

// 🔎 Route test (optionnelle)
app.get('/', (req, res) => {
  res.send('Backend OK');
});

// 👤 Récupérer les utilisateurs depuis PostgreSQL
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.utilisateurs'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur PostgreSQL:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📦 Items (encore en dur pour l’instant)
app.get('/items', (req, res) => {
  res.json([{ id: 1, title: 'Figurine Evil Ed' }]);
});

// 🚀 Lancer le serveur
app.listen(5000, () => {
  console.log('API running on http://localhost:5000');
});
