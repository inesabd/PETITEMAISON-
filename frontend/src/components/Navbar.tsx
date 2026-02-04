import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems, openCart } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="pm-navbar">
      <div className="pm-container">
        <div className="pm-navbar-inner">
          {/* Logo */}
          <Link to="/home" className="pm-logo">
            PETITEMAISON
          </Link>

          {/* Navigation Links */}
          <ul className="pm-nav-links pm-hide-mobile">
            <li className="pm-dropdown">
              <button className="pm-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Collection
                <ChevronDown size={14} />
              </button>
              <div className="pm-dropdown-menu">
                <Link to="/products?category=figurines" className="pm-dropdown-item">Figurines</Link>
                <Link to="/products?category=blu-ray" className="pm-dropdown-item">Blu-ray</Link>
                <Link to="/products?category=jeux" className="pm-dropdown-item">Jeux</Link>
                <Link to="/products?category=livres" className="pm-dropdown-item">Livres</Link>
              </div>
            </li>
            <li>
              <Link to="/products" className="pm-nav-link">Catalogue</Link>
            </li>
            <li>
              <Link to="/products?category=nouveautes" className="pm-nav-link">Nouveautés</Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="pm-nav-actions">
            <button
              className="pm-btn pm-btn-ghost pm-hide-mobile"
              onClick={() => navigate('/products')}
              aria-label="Rechercher"
            >
              <Search size={18} />
            </button>

            {/* Cart Button */}
            <button
              className="pm-btn pm-btn-ghost"
              onClick={openCart}
              aria-label="Ouvrir le panier"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'var(--pm-bordeaux)',
                    color: 'var(--pm-white)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="pm-dropdown">
                <button className="pm-btn pm-btn-secondary pm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} />
                  <span className="pm-hide-mobile">{user.email?.split('@')[0]}</span>
                </button>
                <div className="pm-dropdown-menu" style={{ right: 0, left: 'auto' }}>
                  <a href="#" className="pm-dropdown-item">Mon compte</a>
                  <a href="#" className="pm-dropdown-item">Mes commandes</a>
                  <button
                    onClick={handleLogout}
                    className="pm-dropdown-item"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/" className="pm-btn pm-btn-secondary pm-btn-sm">
                  Connexion
                </Link>
                <Link to="/register" className="pm-btn pm-btn-primary pm-btn-sm pm-hide-mobile">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
