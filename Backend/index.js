require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// ✅ CORS: local + prod (FRONTEND_URL sur Azure)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // ex: https://xxxx.azurestaticapps.net
].filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // autorise curl/postman (pas d'origin)
      if (!origin) return cb(null, true)
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(express.json())

// ✅ PostgreSQL (Azure = SSL en production)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
})

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

    // email déjà utilisé ?
    const existing = await pool.query(
      'SELECT id FROM public.utilisateurs WHERE email = $1',
      [email],
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' })
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // insert
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
      return res
        .status(500)
        .json({ message: 'JWT_SECRET manquant dans la config' })
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
 * ✅ PRODUITS + RECHERCHE + FILTRE CATÉGORIE
 * GET /products
 * GET /products?search=evil
 * GET /products?category=figurines
 * GET /products?search=evil&category=figurines
 */
app.get('/products', async (req, res) => {
  const search = (req.query.search || '').trim()
  const category = (req.query.category || '').trim()

  try {
    let query = `SELECT id, titre, description, categorie, prix, image_url, created_at
                 FROM public.produits`
    const conditions = []
    const params = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(titre ILIKE $${params.length} OR description ILIKE $${params.length})`)
    }

    if (category) {
      params.push(category)
      conditions.push(`LOWER(categorie) = LOWER($${params.length})`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    query += ` ORDER BY id DESC`

    const result = await pool.query(query, params)
    return res.json(result.rows)
  } catch (err) {
    console.error('PRODUCTS error:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
})

// ✅ Listen Azure: PORT fourni par Azure + host 0.0.0.0
const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})
