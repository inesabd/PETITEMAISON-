import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login({ email, password });

      // Attendu côté backend: { token, user }
      setAuth(data.token, data.user);

      // si tu veux désactiver "remember", on peut éviter localStorage (on ajustera après)
      if (!remember) {
        // petit “hack” simple : on videra au refresh (on améliorera ensuite)
        // pour l’instant on garde simple
      }

      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="card auth-card p-4">
        <div className="text-center mb-3">
          <div className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center"
               style={{ width: 64, height: 64 }}>
            <span style={{ fontSize: 28 }}>🔒</span>
          </div>
          <h2 className="auth-title mt-3 mb-0">LOG IN</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              placeholder="ex: user@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <div className="d-flex align-items-center justify-content-between my-3">
            <div className="form-check">
              <input
                className="form-check-input"
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>

            <small className="opacity-75">Forgot password?</small>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <button className="btn btn-light w-100 fw-semibold" disabled={loading}>
            {loading ? 'Connexion...' : 'Login'}
          </button>

          <div className="text-center mt-3">
            <small>
              Pas de compte ? <Link className="text-white fw-semibold" to="/register">Créer un compte</Link>
            </small>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
