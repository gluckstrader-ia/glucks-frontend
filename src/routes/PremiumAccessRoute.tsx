import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  clearAuth,
  isAuthenticated,
  refreshStoredUser,
} from "../lib/auth";

export default function PremiumAccessRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!isAuthenticated()) {
        setAuthenticated(false);
        setAllowed(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);

      try {
        const user = await refreshStoredUser();

        if (!user) {
          clearAuth();
          setAllowed(false);
          setLoading(false);
          return;
        }

        // ADMIN SEMPRE LIBERADO
        if (user.is_admin === true) {
          setAllowed(true);
          return;
        }

        // REGRA FINAL DE ACESSO
        const hasAccess =
          user.is_active === true &&
          user.is_blocked === false &&
          user.has_access === true;

        setAllowed(hasAccess);
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        Validando acesso...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed) {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
}