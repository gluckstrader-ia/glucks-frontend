import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, hasActiveAccess } from "../lib/auth";

export default function ActiveAccessRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasActiveAccess()) {
    return <Navigate to="/premium" replace />;
  }

  return <Outlet />;
}