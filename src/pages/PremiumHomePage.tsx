import { useNavigate } from "react-router-dom";
import HomePremiumScreen from "../components/HomePremiumScreen";
import { clearAuth, getStoredUser } from "../lib/auth";

export default function PremiumHomePage() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <HomePremiumScreen
      userName={user?.name || "Lucineia Gluck"}
      userPlan={user?.plan || "none"}
      onOpenDashboard={() => navigate("/dashboard")}
      onLogout={handleLogout}
    />
  );
}