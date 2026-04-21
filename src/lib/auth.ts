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
  has_access?: boolean;
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

function isFutureDate(value?: string | null): boolean {
  if (!value) return false;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() >= Date.now();
}

export function computeHasAccess(user: AuthUser | null): boolean {
  if (!user) return false;

  if (user.is_admin === true) return true;
  if (user.is_partner === true) return true;

  if (user.is_blocked === true) return false;
  if (user.is_active !== true) return false;

  if ((user.plan_status || "").toLowerCase() !== "active") return false;

  if (user.has_access === true) return true;

  return isFutureDate(user.access_expires_at);
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    has_access: computeHasAccess(user),
  };
}

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

    const normalized = normalizeUser(maybeUser);

    localStorage.setItem(TOKEN_KEY, dataOrToken);
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    return;
  }

  const normalized = normalizeUser(dataOrToken.user);

  localStorage.setItem(TOKEN_KEY, dataOrToken.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
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
    const parsed = JSON.parse(raw) as AuthUser;
    return normalizeUser(parsed);
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  return getUser();
}

export function updateStoredUser(user: AuthUser): void {
  const normalized = normalizeUser(user);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
}

export function refreshStoredUser(user?: AuthUser | null): AuthUser | null {
  if (user) {
    updateStoredUser(user);
    return normalizeUser(user);
  }

  const stored = getUser();
  if (stored) {
    updateStoredUser(stored);
  }
  return stored;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}