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

export function saveAuth(data: AuthResponse): void;
export function saveAuth(token: string, user: AuthUser): void;
export function saveAuth(
  dataOrToken: AuthResponse | string,
  maybeUser?: AuthUser
): void {
  if (typeof dataOrToken === "string") {
    if (!maybeUser) {
      throw new Error("saveAuth requires user when called with token string");
    }

    localStorage.setItem(TOKEN_KEY, dataOrToken);
    localStorage.setItem(USER_KEY, JSON.stringify(maybeUser));
    return;
  }

  localStorage.setItem(TOKEN_KEY, dataOrToken.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(dataOrToken.user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredToken(): string | null {
  return getToken();
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  return getUser();
}

export function updateStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function refreshStoredUser(user: AuthUser): void {
  updateStoredUser(user);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}