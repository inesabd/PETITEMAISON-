import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, register } from '../api/auth'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('API Auth - login()', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('retourne token et user si login réussit', async () => {
    const mockResponse = {
      token: 'jwt-token-123',
      user: { id: 1, nom: 'Test User', email: 'test@test.com' },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await login({ email: 'test@test.com', password: 'Test1234!' })

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'Test1234!' }),
      }),
    )
  })

  it('lance une erreur si email/mot de passe incorrect', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email ou mot de passe incorrect' }),
    })

    await expect(
      login({ email: 'wrong@test.com', password: 'wrong' }),
    ).rejects.toThrow('Email ou mot de passe incorrect')
  })

  it('lance une erreur générique si pas de message serveur', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('parse error')),
    })

    await expect(
      login({ email: 'test@test.com', password: 'Test1234!' }),
    ).rejects.toThrow('Erreur login')
  })
})

describe('API Auth - register()', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('retourne les données utilisateur si inscription réussit', async () => {
    const mockResponse = {
      user: { id: 1, nom: 'New User', email: 'new@test.com', created_at: '2026-02-08' },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await register({
      username: 'New User',
      email: 'new@test.com',
      password: 'Test1234!',
    })

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'New User',
          email: 'new@test.com',
          password: 'Test1234!',
        }),
      }),
    )
  })

  it('lance une erreur si email déjà utilisé', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email déjà utilisé' }),
    })

    await expect(
      register({ username: 'Test', email: 'existing@test.com', password: 'Test1234!' }),
    ).rejects.toThrow('Email déjà utilisé')
  })
})
