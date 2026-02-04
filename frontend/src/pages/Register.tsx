import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Eye, EyeOff, User } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { register } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="pm-auth-card" style={{ maxWidth: 420, margin: '0 auto' }}>
        {/* Header */}
        <div className="pm-auth-header">
          <div className="pm-auth-icon">
            <UserPlus size={24} />
          </div>
          <h1 className="pm-auth-title">Créer un compte</h1>
          <p className="pm-auth-subtitle">
            Rejoignez la communauté des collectionneurs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="pm-input-group">
            <label className="pm-label" htmlFor="username">
              Nom d'utilisateur
            </label>
            <div className="pm-input-icon-wrapper">
              <input
                id="username"
                type="text"
                className="pm-input"
                placeholder="HorrorFan666"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{ paddingRight: '2.5rem' }}
              />
              <span className="pm-input-icon">
                <User size={18} />
              </span>
            </div>
          </div>

          {/* Email Field */}
          <div className="pm-input-group">
            <label className="pm-label" htmlFor="email">
              Adresse email
            </label>
            <div className="pm-input-icon-wrapper">
              <input
                id="email"
                type="email"
                className="pm-input"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ paddingRight: '2.5rem' }}
              />
              <span className="pm-input-icon">
                <Mail size={18} />
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="pm-input-group">
            <label className="pm-label" htmlFor="password">
              Mot de passe
            </label>
            <div className="pm-input-icon-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pm-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pm-input-icon"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 'var(--space-xs)' }}>
              8 caractères minimum
            </p>
          </div>

          {/* Terms Checkbox */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="pm-checkbox-wrapper">
              <input
                type="checkbox"
                className="pm-checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span className="pm-checkbox-label">
                J'accepte les{' '}
                <a href="#" className="pm-auth-footer-link" style={{ fontSize: 'inherit' }}>
                  conditions d'utilisation
                </a>
                {' '}et la{' '}
                <a href="#" className="pm-auth-footer-link" style={{ fontSize: 'inherit' }}>
                  politique de confidentialité
                </a>
              </span>
            </label>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="pm-alert pm-alert-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="pm-btn pm-btn-primary pm-btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="pm-spinner" />
                Création...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pm-auth-footer">
          <p className="pm-auth-footer-text">
            Déjà un compte ?{' '}
            <Link to="/" className="pm-auth-footer-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
