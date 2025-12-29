import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const handleSearch = () => {
    const q = search.trim()
    if (!q) {
      navigate("/products")
      return
    }
    navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container py-2">
          <a className="navbar-brand fw-bold" href="#">
            PETITEMAISON
          </a>

          <div className="d-flex align-items-center gap-2">
            {/* Produit */}
            <div className="dropdown">
              <button
                className="btn btn-link text-dark text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Produit
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Figurines</a></li>
                <li><a className="dropdown-item" href="#">Blu-ray</a></li>
                <li><a className="dropdown-item" href="#">Jeux</a></li>
              </ul>
            </div>

            {/* Bouton Vendre */}
            <button className="btn btn-outline-primary fw-semibold">
              Vendre
            </button>

            {/* Se connecter */}
            <button className="btn btn-primary fw-semibold">
              Se connecter
            </button>
          </div>
        </div>
      </nav>

      {/* BODY */}
      <main className="container py-5">
        <div className="text-center mx-auto" style={{ maxWidth: 820 }}>
          <h1 className="display-5 fw-semibold">
            Découvrez nos produits horrifiques
          </h1>

          <p className="text-muted mt-3">
            Recherchez un produit, une figurine, un blu-ray ou un jeu.
          </p>

          {/* 🔎 BARRE DE RECHERCHE */}
          <div className="mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
              }}
            >
              <div
                className="input-group input-group-lg"
                style={{ maxWidth: 700, margin: "0 auto" }}
              >
                <input
                  className="form-control"
                  placeholder="Rechercher tous les produits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                  aria-label="Rechercher"
                  title="Rechercher"
                >
                  🔎
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-5 border-top pt-4">
          <h2 className="h5 fw-semibold">Produits populaires</h2>
          <p className="text-muted mb-4">
            Une sélection pour te donner des idées.
          </p>

          <div className="row g-3">
            {[
              { title: "Figurine Evil Ed", subtitle: "Exclusivité web" },
              { title: "Blu-ray restauré", subtitle: "Édition limitée" },
              { title: "Jeu de société", subtitle: "Pour frissonner à plusieurs" },
            ].map((item) => (
              <div className="col-12 col-md-4" key={item.title}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="fw-semibold">{item.title}</div>
                    <div className="text-muted small mt-1">
                      {item.subtitle}
                    </div>
                    <button className="btn btn-sm btn-outline-dark mt-3">
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
