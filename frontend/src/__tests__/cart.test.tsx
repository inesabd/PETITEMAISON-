import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider, useCart } from '../context/CartContext'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

const mockProduct = {
  id: 1,
  titre: 'Figurine Evil Ed',
  prix: 89,
  categorie: 'Figurines',
  image_url: null,
}

const mockProduct2 = {
  id: 2,
  titre: 'Pennywise Ultimate',
  prix: 45,
  categorie: 'Figurines',
  image_url: null,
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initialise avec un panier vide', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('ajoute un produit au panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].titre).toBe('Figurine Evil Ed')
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(89)
  })

  it('incrémente la quantité si le produit existe déjà', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.totalPrice).toBe(178)
  })

  it('calcule le total avec plusieurs produits', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.addItem(mockProduct2)
    })

    expect(result.current.items).toHaveLength(2)
    expect(result.current.totalItems).toBe(2)
    expect(result.current.totalPrice).toBe(134) // 89 + 45
  })

  it('supprime un produit du panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.addItem(mockProduct2)
    })
    act(() => {
      result.current.removeItem(1)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].titre).toBe('Pennywise Ultimate')
  })

  it('vide le panier complètement', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.addItem(mockProduct2)
    })
    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('met à jour la quantité d\'un produit', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.updateQuantity(1, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.totalPrice).toBe(445) // 89 * 5
  })

  it('supprime un produit si la quantité passe à 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockProduct)
    })
    act(() => {
      result.current.updateQuantity(1, 0)
    })

    expect(result.current.items).toHaveLength(0)
  })
})
