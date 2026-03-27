import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getStoredUser } from "../lib/auth";

export default function ProtectedRoute() {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.has_access === false) {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
}