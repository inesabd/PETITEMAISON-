import { describe, it, expect } from 'vitest'
import request from 'supertest'

// On importe l'app Express (sans démarrer le serveur)
const app = require('../index.js')

describe('GET / - Health check', () => {
  it('retourne 200 et Backend OK', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.text).toContain('Backend OK')
  })
})

describe('GET /users - Route protégée', () => {
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
    expect(res.body.message).toBe('Token invalide ou expiré')
  })
})

describe('POST /auth/login - Authentification', () => {
  it('retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Champs manquants')
  })

  it('retourne 400 si mot de passe manquant', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Champs manquants')
  })
})

describe('POST /auth/register - Inscription', () => {
  it('retourne 400 si champs manquants', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@test.com' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Champs manquants')
  })

  it('retourne 400 si email manquant', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'Test', password: 'Test1234!' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Champs manquants')
  })
})

describe('Sécurité - Headers Helmet', () => {
  it('inclut les headers de sécurité', async () => {
    const res = await request(app).get('/')

    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
  })
})
