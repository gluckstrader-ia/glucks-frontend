import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../lib/auth";

export default function PartnerRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin pode acessar tudo
  if (user?.is_admin === true) {
    return <Outlet />;
  }

  // Só parceiro ativo entra na área do parceiro
  const isPartner =
    !!user &&
    user.is_partner === true &&
    user.is_blocked === false &&
    (user.partner_status === "active" || !user.partner_status);

  if (!isPartner) {
    return <Navigate to="/parceiros" replace />;
  }

  return <Outlet />;
}