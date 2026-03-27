import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getStoredUser } from "../lib/auth";

export default function PublicOnlyRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Outlet />;
  }

  if (user?.has_access) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/premium" replace />;
}