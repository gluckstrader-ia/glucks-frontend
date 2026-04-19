import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

export default function ProtectedRoute() {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}