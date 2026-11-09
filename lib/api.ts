const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type RegisterPayload = {
  email: string;
  password: string;
  gender: string;
  birth_date: string; // YYYY-MM-DD
};

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/UserRegistration/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),

    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Ошибка регистрации');
  }

  return res.json();
}

export async function loginUser(payload: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Ошибка входа');
  }
  return res.json() as Promise<{ access_token: string }>;

}