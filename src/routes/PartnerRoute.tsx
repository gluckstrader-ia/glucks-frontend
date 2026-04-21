import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../lib/auth";

export default function PartnerRoute() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_partner !== true) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}