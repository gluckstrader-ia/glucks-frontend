import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, getStoredToken } from "../lib/auth";

export default function AdminRoute() {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_admin !== true) {
    return <Navigate to="/home-premium" replace />;
  }

  return <Outlet />;
}