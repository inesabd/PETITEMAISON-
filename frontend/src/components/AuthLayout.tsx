import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="pm-auth-layout">
      {/* Background decorative element */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(139, 38, 53, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(184, 166, 122, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Link
            to="/home"
            className="pm-logo"
            style={{ fontSize: '1.5rem' }}
          >
            PETITEMAISON
          </Link>
        </div>

        {children}

        {/* Back to home link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <Link
            to="/home"
            className="pm-auth-footer-link"
            style={{ fontSize: '0.8125rem', opacity: 0.7 }}
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
