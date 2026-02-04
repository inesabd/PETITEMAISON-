import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORY_ICONS: Record<string, string> = {
  figurines: '💀',
  'blu-ray': '🎬',
  jeux: '🎲',
  livres: '📕',
  default: '📦',
};

function getIcon(cat: string): string {
  const key = cat?.toLowerCase().replace(/[^a-z-]/g, '') || 'default';
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay"
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 998,
          opacity: 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        className="cart-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: 420,
          height: '100vh',
          background: 'var(--pm-white)',
          boxShadow: '-4px 0 30px rgba(0, 0, 0, 0.15)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-lg)',
            borderBottom: '1px solid var(--pm-cream-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <ShoppingBag size={20} style={{ color: 'var(--pm-bordeaux)' }} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Panier
            </h2>
            {totalItems > 0 && (
              <span
                style={{
                  background: 'var(--pm-bordeaux)',
                  color: 'var(--pm-white)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--pm-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Fermer le panier"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-lg)', color: 'var(--pm-text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-lg)' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--pm-text)', marginBottom: 'var(--space-sm)' }}>
                Votre panier est vide
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Découvrez notre collection de produits horrifiques !
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    background: 'var(--pm-cream-soft)',
                    borderRadius: '8px',
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      flexShrink: 0,
                      background: 'var(--pm-cream-warm)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.titre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ) : (
                      getIcon(item.categorie)
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.titre}
                    </h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.75rem', color: 'var(--pm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.categorie}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--pm-bordeaux)' }}>
                      {item.prix.toFixed(2)} €
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--pm-text-muted)',
                        padding: '0.25rem',
                      }}
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--pm-white)',
                          border: '1px solid var(--pm-cream-dark)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--pm-white)',
                          border: '1px solid var(--pm-cream-dark)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: 'var(--space-lg)',
              borderTop: '1px solid var(--pm-cream-dark)',
              background: 'var(--pm-cream-soft)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <span style={{ color: 'var(--pm-text-muted)' }}>Sous-total</span>
              <span style={{ fontWeight: 600 }}>{totalPrice.toFixed(2)} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--pm-bordeaux)' }}>
                {totalPrice.toFixed(2)} €
              </span>
            </div>
            <button
              className="pm-btn pm-btn-primary pm-btn-lg"
              style={{ width: '100%', marginBottom: 'var(--space-sm)' }}
            >
              Commander
            </button>
            <button
              onClick={clearCart}
              className="pm-btn pm-btn-ghost"
              style={{ width: '100%', fontSize: '0.8125rem' }}
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
