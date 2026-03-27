import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../lib/auth";

export default function ProtectedRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess =
    !!user &&
    user.is_active === true &&
    user.is_blocked === false;

  if (!hasAccess) {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
}