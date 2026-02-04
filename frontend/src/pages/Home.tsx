import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Search, ArrowRight, Skull, Film, Gamepad2, ShoppingCart, Check } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useCart } from "../context/CartContext"

const FEATURED_PRODUCTS = [
  {
    id: 101,
    titre: "Figurine Evil Ed",
    description: "Exclusivité web - Édition collector",
    categorie: "Figurines",
    prix: 89.00,
    image_url: null,
  },
  {
    id: 102,
    titre: "Coffret Blu-ray Restauré",
    description: "Édition limitée - Masters of Horror",
    categorie: "Blu-ray",
    prix: 49.00,
    image_url: null,
  },
  {
    id: 103,
    titre: "Jeu de société Mysterium",
    description: "Pour frissonner à plusieurs",
    categorie: "Jeux",
    prix: 39.00,
    image_url: null,
  },
]

const CATEGORIES = [
  { name: "Figurines", slug: "figurines", icon: Skull },
  { name: "Blu-ray", slug: "blu-ray", icon: Film },
  { name: "Jeux", slug: "jeux", icon: Gamepad2 },
]

const CATEGORY_ICONS: Record<string, string> = {
  figurines: '💀',
  'blu-ray': '🎬',
  jeux: '🎲',
}

export default function Home() {
  const [search, setSearch] = useState("")
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())
  const navigate = useNavigate()
  const { addItem } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) {
      navigate("/products")
      return
    }
    navigate(`/products?search=${encodeURIComponent(q)}`)
  }

  const handleAddToCart = (product: typeof FEATURED_PRODUCTS[0]) => {
    addItem({
      id: product.id,
      titre: product.titre,
      prix: product.prix,
      categorie: product.categorie,
      image_url: product.image_url,
    })

    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Light Effects */}
      <section className="pm-hero">
        {/* Aurora Background Effect */}
        <div className="pm-aurora" aria-hidden="true" />

        {/* Floating Light Orbs */}
        <div className="pm-glow-orb pm-glow-orb--bordeaux" aria-hidden="true" style={{
          width: '400px',
          height: '400px',
          top: '10%',
          left: '5%',
          animationDelay: '0s'
        }} />
        <div className="pm-glow-orb pm-glow-orb--gold" aria-hidden="true" style={{
          width: '350px',
          height: '350px',
          top: '60%',
          right: '10%',
          animationDelay: '2s'
        }} />
        <div className="pm-glow-orb pm-glow-orb--warm" aria-hidden="true" style={{
          width: '300px',
          height: '300px',
          bottom: '10%',
          left: '30%',
          animationDelay: '4s'
        }} />

        {/* Floating Particles */}
        <div className="pm-particles" aria-hidden="true">
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
          <div className="pm-particle" />
        </div>

        {/* Spotlight Effect */}
        <div className="pm-spotlight" aria-hidden="true" />

        {/* Film Grain Texture */}
        <div className="pm-grain" aria-hidden="true" />

        {/* Vignette */}
        <div className="pm-vignette" aria-hidden="true" />

        <div className="pm-hero-content">
          <p className="pm-hero-eyebrow">Collection Horrifique</p>
          <h1 className="text-display-xl pm-hero-title">
            L'art de l'épouvante,<br />
            <span className="text-bordeaux">soigneusement curé</span>
          </h1>
          <p className="pm-hero-subtitle">
            Figurines de collection, éditions limitées, jeux immersifs
            pour les passionnés d'horreur.
          </p>

          <div className="pm-hero-search">
            <form onSubmit={handleSearch}>
              <div className="pm-search-wrapper pm-glow-hover">
                <input
                  type="text"
                  className="pm-input pm-search-input"
                  placeholder="Rechercher un produit, une franchise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="pm-search-btn" aria-label="Rechercher">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="pm-section">
        <div className="pm-container">
          <div className="pm-section-header">
            <div>
              <p className="pm-section-eyebrow">Explorer</p>
              <h2 className="pm-section-title">Par catégorie</h2>
            </div>
            <Link to="/products" className="pm-section-link">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pm-grid pm-grid-3 pm-stagger">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="pm-card pm-category-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="pm-card-body" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                  <div className="pm-category-icon" style={{
                    width: 80,
                    height: 80,
                    margin: '0 auto var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(114, 47, 55, 0.08) 0%, rgba(196, 160, 108, 0.08) 100%)',
                    borderRadius: '50%',
                    color: 'var(--pm-bordeaux)',
                    position: 'relative',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    {/* Glow ring */}
                    <div style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(114, 47, 55, 0.2) 0%, rgba(196, 160, 108, 0.2) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                      filter: 'blur(8px)'
                    }} className="pm-icon-glow" />
                    <cat.icon size={32} style={{ position: 'relative', zIndex: 1 }} />
                  </div>
                  <h3 className="pm-card-title" style={{ marginBottom: 0 }}>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="pm-section pm-section-alt">
        <div className="pm-container">
          <div className="pm-section-header">
            <div>
              <p className="pm-section-eyebrow">Sélection</p>
              <h2 className="pm-section-title">Produits populaires</h2>
            </div>
            <Link to="/products" className="pm-section-link">
              Tout parcourir <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pm-grid pm-grid-3 pm-stagger">
            {FEATURED_PRODUCTS.map((product) => (
              <article key={product.id} className="pm-card">
                <div className="pm-card-image">
                  <div className="pm-card-image-placeholder">
                    {CATEGORY_ICONS[product.categorie.toLowerCase()] || '📦'}
                  </div>
                </div>
                <div className="pm-card-body">
                  <p className="pm-card-category">{product.categorie}</p>
                  <h3 className="pm-card-title">{product.titre}</h3>
                  <p className="text-muted text-body-sm">
                    {product.description}
                  </p>
                  <div className="pm-card-footer">
                    <p className="pm-card-price" style={{ margin: 0 }}>{product.prix.toFixed(2)} €</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`pm-btn pm-btn-sm ${addedIds.has(product.id) ? 'pm-btn-gold' : 'pm-btn-primary'}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {addedIds.has(product.id) ? (
                        <>
                          <Check size={14} />
                          Ajouté
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} />
                          Ajouter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="pm-section">
        <div className="pm-container pm-container-md">
          <div className="pm-newsletter-card" style={{
            textAlign: 'center',
            padding: 'var(--space-3xl) var(--space-xl)',
            background: 'var(--pm-white)',
            border: '1px solid var(--pm-cream-dark)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-medium)'
          }}>
            {/* Animated corner glow */}
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(196, 160, 108, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              animation: 'newsletterGlow 8s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(114, 47, 55, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              animation: 'newsletterGlow 8s ease-in-out infinite reverse'
            }} />
            {/* Decorative gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(114, 47, 55, 0.03), transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="pm-section-eyebrow" style={{ marginBottom: 'var(--space-md)' }}>Newsletter</p>
              <h2 className="text-display-md" style={{ marginBottom: 'var(--space-md)' }}>
                Restez informé des nouveautés
              </h2>
              <p className="text-muted" style={{ maxWidth: 400, margin: '0 auto var(--space-xl)' }}>
                Nouvelles éditions, précommandes exclusives et événements spéciaux.
              </p>

              <form style={{ display: 'flex', gap: 'var(--space-sm)', maxWidth: 400, margin: '0 auto' }}>
                <input
                  type="email"
                  className="pm-input"
                  placeholder="votre@email.com"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="pm-btn pm-btn-primary">
                  S'inscrire
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
