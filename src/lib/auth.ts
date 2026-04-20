export type AuthUser = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_blocked: boolean;
  is_admin: boolean;
  plan: string;
  plan_status: string;
  access_expires_at: string | null;
  has_access: boolean;
  is_partner?: boolean;
  partner_code?: string | null;
  partner_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function getApiUrl() {
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const user = JSON.parse(raw);

    return {
      ...user,
      has_access: user?.has_access === true,
      is_active: user?.is_active === true,
      is_blocked: user?.is_blocked === true,
      is_admin: user?.is_admin === true,
      is_partner: user?.is_partner === true,
      partner_code: user?.partner_code ?? null,
      partner_status: user?.partner_status ?? null,
    };
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!getStoredToken();
}

export function hasActiveAccess() {
  const user = getStoredUser();

  if (!user) return false;
  if (user.is_admin === true) return true;

  return (
    user.is_active === true &&
    user.is_blocked === false &&
    user.has_access === true
  );
}

export function isAdminUser() {
  const user = getStoredUser();
  return !!user && user.is_admin === true;
}

export async function refreshStoredUser() {
  const token = getStoredToken();
  if (!token) return null;

  const res = await fetch(`${getApiUrl()}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const user: AuthUser = await res.json();
  updateStoredUser(user);
  return user;
}