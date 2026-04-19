import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../lib/auth";

export default function ActiveAccessRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.is_admin === true) {
    return <Outlet />;
  }

  const hasAccess =
    !!user &&
    user.is_active === true &&
    user.is_blocked === false &&
    user.has_access === true;

  if (!hasAccess) {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
}