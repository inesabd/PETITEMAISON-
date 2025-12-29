import { useLocation } from 'react-router-dom'

export default function ProductsPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const search = params.get('search') || ''

  return (
    <div className="container py-5">
      <h1 className="h3 fw-semibold">Produits</h1>

      {search ? (
        <p className="text-muted">
          Résultats pour : <strong>{search}</strong>
        </p>
      ) : (
        <p className="text-muted">
          Tous les produits
        </p>
      )}
    </div>
  )
}
