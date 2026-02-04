import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({ email, password });
      setAuth(data.token, data.user);
      navigate('/home');
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
            <Lock size={24} />
          </div>
          <h1 className="pm-auth-title">Connexion</h1>
          <p className="pm-auth-subtitle">
            Accédez à votre espace collectionneur
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
                autoComplete="current-password"
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
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="pm-flex pm-flex-between" style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="pm-checkbox-wrapper">
              <input
                type="checkbox"
                className="pm-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="pm-checkbox-label">Se souvenir de moi</span>
            </label>
            <a
              href="#"
              className="pm-auth-footer-link"
              style={{ fontSize: '0.8125rem' }}
            >
              Mot de passe oublié ?
            </a>
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
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pm-auth-footer">
          <p className="pm-auth-footer-text">
            Pas encore de compte ?{' '}
            <Link to="/register" className="pm-auth-footer-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
