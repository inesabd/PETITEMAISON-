const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { username: string; email: string; password: string };

export async function login(payload: LoginPayload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Erreur login');
  return data; // ex: { token, user }
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Erreur register');
  return data;
}
