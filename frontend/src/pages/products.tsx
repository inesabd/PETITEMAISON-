import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

type Produit = {
  id: number
  titre: string
  description: string
  categorie: string
  prix: string
  image_url: string | null
  created_at: string
}

export default function ProductsPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const search = params.get('search') || ''

  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true)
      setError(null)

      try {
        const url = search
          ? `http://localhost:5000/products?search=${encodeURIComponent(search)}`
          : `http://localhost:5000/products`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Erreur API')

        const data = await res.json()
        setProduits(Array.isArray(data) ? data : [])
      } catch (e) {
        setError("Impossible de charger les produits")
      } finally {
        setLoading(false)
      }
    }

    fetchProduits()
  }, [search])

  return (
    <div className="container py-5">
      <h1 className="h3 fw-semibold">Produits</h1>

      {search ? (
        <p className="text-muted">
          Résultats pour : <strong>{search}</strong>
        </p>
      ) : (
        <p className="text-muted">Tous les produits</p>
      )}

      {loading && <p>Chargement...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <div className="list-group mt-4">
          {produits.map((p) => (
            <div key={p.id} className="list-group-item">
              <div className="fw-semibold">{p.titre}</div>
              <div className="text-muted small">
                {p.categorie} — {p.prix} €
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
