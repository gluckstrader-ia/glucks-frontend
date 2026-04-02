import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../lib/auth";

export default function AdminRoute() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_admin) {
    return <Navigate to="/home-premium" replace />;
  }

  return <Outlet />;
}