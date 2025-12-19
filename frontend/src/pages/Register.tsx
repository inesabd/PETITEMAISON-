import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { register } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ username, email, password });
      // après inscription, on renvoie vers login
      navigate('/login');
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
            <span style={{ fontSize: 28 }}>🧾</span>
          </div>
          <h2 className="auth-title mt-3 mb-0">REGISTER</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="ex: horrorFan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          {error && (
            <div className="alert alert-danger py-2 mt-3" role="alert">
              {error}
            </div>
          )}

          <button className="btn btn-light w-100 fw-semibold mt-3" disabled={loading}>
            {loading ? 'Création...' : 'Créer le compte'}
          </button>

          <div className="text-center mt-3">
            <small>
              Déjà un compte ? <Link className="text-white fw-semibold" to="/login">Se connecter</Link>
            </small>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
