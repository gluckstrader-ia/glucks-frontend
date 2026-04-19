export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const user = JSON.parse(raw);

    return {
      ...user,
      has_access: !!user?.has_access,
      is_active: !!user?.is_active,
      is_blocked: !!user?.is_blocked,
    };
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: any) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!getStoredToken();
}

/**
 * 🔥 NOVO — helper para verificar acesso ativo
 */
export function hasActiveAccess() {
  const user = getStoredUser();

  return (
    !!user &&
    user.is_active === true &&
    user.is_blocked === false &&
    user.has_access === true
  );
}