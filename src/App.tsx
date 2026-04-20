import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PremiumPage from "./pages/PremiumPage";
import PremiumHomePage from "./pages/PremiumHomePage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminRoute from "./routes/AdminRoute";
import IndicadorPage from "./pages/IndicadorPage";
import RoboPage from "./pages/RoboPage";
import CursoPage from "./pages/CursoPage";
import RegisterTrialPage from "./pages/RegisterTrialPage";
import PartnerDashboardPage from "./pages/PartnerDashboardPage";
import AffiliateLandingPage from "./pages/AffiliateLandingPage";
import PartnerRegisterPage from "./pages/PartnerRegisterPage";
import AdminAffiliatesPage from "./pages/AdminAffiliatesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
        </Route>

        <Route path="/parceiros" element={<AffiliateLandingPage />} />
        <Route path="/cadastro-parceiro" element={<PartnerRegisterPage />} />

        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/indicador" element={<IndicadorPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home-premium" element={<PremiumHomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard-parceiro" element={<PartnerDashboardPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/afiliados" element={<AdminAffiliatesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/robo" element={<RoboPage />} />

        <Route path="/curso" element={<CursoPage />} />

        <Route path="/cadastro-trial" element={<RegisterTrialPage />} />


      </Routes>
    </BrowserRouter>
  );
}