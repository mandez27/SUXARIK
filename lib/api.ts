const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// --- ТИПЫ ---
export type RegisterPayload = {
  email: string;
  password: string;
  gender: string; // 'М' или 'Ж'
  birth_date: string; // YYYY-MM-DD
};

export type LoginPayload = {
  email: string;
  password: string;
};

// --- ЭНДПОИНТЫ ---

// 1. РЕГИСТРАЦИЯ: /UserRegisrtation/register
export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/UserRegisrtation/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Ошибка регистрации');
  }
  return res.json();
}

// 2. ВХОД: /Login/login
export async function loginUser(payload: LoginPayload) {
  const res = await fetch(`${API_URL}/Login/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Неверная почта или пароль');
  }
  return res.json(); // Ожидаем { access_token: "..." } или подобное
}

// 3. ВЫХОД: /Logout/logout
export async function logoutUser(token: string) {
  const res = await fetch(`${API_URL}/Logout/logout`, {
    method: 'POST', // или GET, в зависимости от вашего бэкенда
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  
  if (!res.ok) throw new Error('Ошибка выхода');
  return res.json();
}

// 4. ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ: /GetUser
export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_URL}/GetUser`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error('Не авторизован');
  return res.json();
}

// 5. УДАЛЕНИЕ: /DeleteUser/delete_user
export async function deleteUser(token: string) {
  const res = await fetch(`${API_URL}/DeleteUser/delete_user`, {
    method: 'DELETE', // или POST, уточните на бэкенде
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error('Ошибка удаления аккаунта');
  return res.json();
}

// 6. ПОИСК ПО ГЕНДЕРУ: /gender_finder/
export async function getUsersByGender(gender: string, token?: string) {
  const res = await fetch(`${API_URL}/gender_finder/?gender=${gender}`, {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Ошибка загрузки данных');
  return res.json();
}