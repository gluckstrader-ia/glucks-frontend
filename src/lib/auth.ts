export type AuthUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  is_partner: boolean;
  partner_code?: string | null;
  partner_status?: string | null;
  referred_by_user_id?: number | null;
  referred_by_code?: string | null;
  plan: string;
  plan_status: string;
  access_expires_at?: string | null;
  has_access: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

const TOKEN_KEY = "glucks_token";
const USER_KEY = "glucks_user";

export function saveAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}