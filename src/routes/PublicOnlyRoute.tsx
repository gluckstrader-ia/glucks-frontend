import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "../lib/auth";

export default function PublicOnlyRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Outlet />;
  }

  const hasAccess =
    !!user &&
    user.is_active === true &&
    user.is_blocked === false;

  if (hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/premium" replace />;
}