require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// ✅ AJOUT pour lire schema.sql
const fs = require('fs')
const path = require('path')

const app = express()

// ✅ IMPORTANT: sur Render, le frontend ne sera plus localhost
// Pour l'instant on autorise localhost + ton futur domaine Vercel
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL, // tu le mettras plus tard dans Render
    ].filter(Boolean),
  }),
)

app.use(express.json())

// 🔌 Connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // ✅ utile sur Render selon l’URL
})

// ✅ AJOUT : appliquer schema.sql une seule fois au démarrage
async function applySchema() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql') // Backend/schema.sql

    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8')
      await pool.query(sql)
      console.log('✅ Database schema applied')
    } else {
      console.log('ℹ️ No schema.sql found (skip)')
    }
  } catch (err) {
    console.error('❌ Schema apply error:', err)
  }
}

// 🔎 Route test
app.get('/', (req, res) => {
  res.send('Backend OK ✅')
})

// 👤 Test users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.utilisateurs')
    res.json(result.rows)
  } catch (error) {
    console.error('Erreur PostgreSQL:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

/**
 * ✅ REGISTER
 * body: { username, email, password }
 */
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Champs manquants' })
    }

    const existing = await pool.query(
      'SELECT id FROM public.utilisateurs WHERE email = $1',
      [email],
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const insert = await pool.query(
      `INSERT INTO public.utilisateurs (nom, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nom, email, created_at`,
      [username, email, passwordHash],
    )

    return res.status(201).json({ user: insert.rows[0] })
  } catch (err) {
    console.error('REGISTER error:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

/**
 * ✅ LOGIN
 * body: { email, password }
 * response: { token, user }
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Champs manquants' })
    }

    const result = await pool.query(
      'SELECT id, nom, email, password_hash FROM public.utilisateurs WHERE email = $1',
      [email],
    )

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect' })
    }

    const user = result.rows[0]

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect' })
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET manquant dans .env' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    )

    return res.json({
      token,
      user: { id: user.id, nom: user.nom, email: user.email },
    })
  } catch (err) {
    console.error('LOGIN error:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

/**
 * ✅ PRODUITS + RECHERCHE
 * GET /products
 * GET /products?search=evil
 */
app.get('/products', async (req, res) => {
  const search = (req.query.search || '').trim()

  try {
    if (!search) {
      const result = await pool.query(
        `SELECT id, titre, description, categorie, prix, image_url, created_at
         FROM public.produits
         ORDER BY id DESC`,
      )
      return res.json(result.rows)
    }

    const result = await pool.query(
      `SELECT id, titre, description, categorie, prix, image_url, created_at
       FROM public.produits
       WHERE titre ILIKE $1 OR description ILIKE $1
       ORDER BY id DESC`,
      [`%${search}%`],
    )

    return res.json(result.rows)
  } catch (err) {
    console.error('PRODUCTS error:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

// 🚀 Lancer le serveur (applique schema AVANT)
const PORT = process.env.PORT || 5000

applySchema().finally(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
  })
})
