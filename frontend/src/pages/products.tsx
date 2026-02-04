import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Package, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

interface Produit {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  prix: string;
  image_url: string | null;
  created_at: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  figurines: '💀',
  'blu-ray': '🎬',
  jeux: '🎲',
  livres: '📕',
  default: '📦',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const category = params.get('category') || '';

  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState(search);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);

        const url = queryParams.toString()
          ? `${API_URL}/products?${queryParams.toString()}`
          : `${API_URL}/products`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur API');

        const data = await res.json();
        setProduits(Array.isArray(data) ? data : []);
      } catch {
        setError('Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [search, category]);

  const getIcon = (cat: string) => {
    const key = cat?.toLowerCase().replace(/[^a-z-]/g, '') || 'default';
    return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (localSearch.trim()) {
      searchParams.set('search', localSearch.trim());
    }
    if (category) {
      searchParams.set('category', category);
    }
    navigate(`/products?${searchParams.toString()}`);
  };

  const handleAddToCart = (product: Produit) => {
    addItem({
      id: product.id,
      titre: product.titre,
      prix: parseFloat(product.prix),
      categorie: product.categorie,
      image_url: product.image_url,
    });

    // Show feedback
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      figurines: 'Figurines',
      'blu-ray': 'Blu-ray',
      jeux: 'Jeux',
      livres: 'Livres',
      nouveautes: 'Nouveautés',
    };
    return labels[cat.toLowerCase()] || cat;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Page Header */}
        <div style={{
          background: 'var(--pm-white)',
          borderBottom: '1px solid var(--pm-cream-dark)',
          padding: 'var(--space-xl) 0'
        }}>
          <div className="pm-container">
            {/* Breadcrumb */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <Link
                to="/home"
                className="pm-section-link"
                style={{ display: 'inline-flex', fontSize: '0.8125rem' }}
              >
                <ArrowLeft size={14} />
                Retour à l'accueil
              </Link>
            </div>

            <div className="pm-flex pm-flex-between" style={{ flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
              <div>
                <p className="pm-section-eyebrow">Catalogue</p>
                <h1 className="text-display-md" style={{ margin: 0 }}>
                  {category ? (
                    <>{getCategoryLabel(category)}</>
                  ) : search ? (
                    <>Résultats pour : <span className="text-bordeaux">"{search}"</span></>
                  ) : (
                    'Tous les produits'
                  )}
                </h1>
              </div>

              {/* Search & Filters */}
              <div className="pm-flex pm-gap-md" style={{ alignItems: 'center' }}>
                <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="pm-input"
                    placeholder="Rechercher..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    style={{ width: 240, paddingRight: '2.5rem' }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--pm-text-muted)',
                      cursor: 'pointer'
                    }}
                    aria-label="Rechercher"
                  >
                    <Search size={18} />
                  </button>
                </form>

                <button className="pm-btn pm-btn-secondary pm-btn-sm">
                  <Filter size={16} />
                  Filtres
                </button>

                <div className="pm-flex pm-gap-sm pm-hide-mobile">
                  <button
                    className={`pm-btn pm-btn-ghost pm-btn-sm ${viewMode === 'grid' ? 'text-bordeaux' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Vue grille"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    className={`pm-btn pm-btn-ghost pm-btn-sm ${viewMode === 'list' ? 'text-bordeaux' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="Vue liste"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            {!search && (
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <Link
                  to="/products"
                  className={`pm-btn pm-btn-sm ${!category ? 'pm-btn-primary' : 'pm-btn-secondary'}`}
                >
                  Tous
                </Link>
                {['figurines', 'blu-ray', 'jeux', 'livres'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className={`pm-btn pm-btn-sm ${category === cat ? 'pm-btn-primary' : 'pm-btn-secondary'}`}
                  >
                    {getCategoryLabel(cat)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Content */}
        <section className="pm-section">
          <div className="pm-container">
            {/* Loading State */}
            {loading && (
              <div className="pm-loading">
                <span className="pm-spinner" />
                <span>Chargement des produits...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="pm-alert pm-alert-error" style={{ maxWidth: 500, margin: '0 auto' }}>
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && produits.length === 0 && (
              <div className="pm-empty">
                <div className="pm-empty-icon">
                  <Package size={48} />
                </div>
                <h3 className="pm-empty-title">Aucun produit trouvé</h3>
                <p className="pm-empty-text">
                  {search
                    ? `Aucun résultat pour "${search}". Essayez d'autres termes de recherche.`
                    : 'Aucun produit disponible dans cette catégorie pour le moment.'}
                </p>
                <Link to="/products" className="pm-btn pm-btn-secondary" style={{ marginTop: 'var(--space-lg)' }}>
                  Voir tous les produits
                </Link>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && produits.length > 0 && (
              <>
                <p className="text-muted text-body-sm" style={{ marginBottom: 'var(--space-xl)' }}>
                  {produits.length} produit{produits.length > 1 ? 's' : ''} trouvé{produits.length > 1 ? 's' : ''}
                </p>

                {viewMode === 'grid' ? (
                  <div className="pm-grid pm-grid-4 pm-stagger">
                    {produits.map((product) => (
                      <article key={product.id} className="pm-card">
                        <div className="pm-card-image">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.titre} />
                          ) : (
                            <div className="pm-card-image-placeholder">
                              {getIcon(product.categorie)}
                            </div>
                          )}
                        </div>
                        <div className="pm-card-body">
                          <p className="pm-card-category">{product.categorie}</p>
                          <h3 className="pm-card-title">{product.titre}</h3>
                          {product.description && (
                            <p className="text-muted text-body-sm" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {product.description}
                            </p>
                          )}
                          <div className="pm-card-footer">
                            <p className="pm-card-price" style={{ margin: 0 }}>{parseFloat(product.prix).toFixed(2)} €</p>
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
                ) : (
                  <div className="pm-product-list pm-stagger">
                    {produits.map((product) => (
                      <div key={product.id} className="pm-product-list-item">
                        <div className="pm-product-list-image">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.titre}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          ) : (
                            getIcon(product.categorie)
                          )}
                        </div>
                        <div className="pm-product-list-content">
                          <h3 className="pm-product-list-title">{product.titre}</h3>
                          <p className="pm-product-list-meta">
                            {product.categorie}
                            {product.description && ` — ${product.description.slice(0, 60)}${product.description.length > 60 ? '...' : ''}`}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                          <div className="pm-product-list-price">{parseFloat(product.prix).toFixed(2)} €</div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`pm-btn pm-btn-sm ${addedIds.has(product.id) ? 'pm-btn-gold' : 'pm-btn-primary'}`}
                          >
                            {addedIds.has(product.id) ? <Check size={16} /> : <ShoppingCart size={16} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
