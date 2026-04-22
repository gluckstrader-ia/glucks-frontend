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
import AffiliateLandingPage from "./pages/AffiliateLandingPage";
import AdminAffiliatesPage from "./pages/AdminAffiliatesPage";
import PartnerRegisterPage from "./pages/PartnerRegisterPage";
import PartnerDashboardPage from "./pages/PartnerDashboardPage";
import PartnerRoute from "./routes/PartnerRoute";
import LiveRoomPage from "./pages/LiveRoomPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/cadastro-parceiro" element={<PartnerRegisterPage />} />
        </Route>

        <Route path="/parceiros" element={<AffiliateLandingPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/indicador" element={<IndicadorPage />} />
        <Route path="/robo" element={<RoboPage />} />
        <Route path="/curso" element={<CursoPage />} />
        <Route path="/cadastro-trial" element={<RegisterTrialPage />} />

        {/* SISTEMA PRINCIPAL - clientes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home-premium" element={<PremiumHomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/live-room" element={<LiveRoomPage />} />
        </Route>

        {/* SISTEMA DE PARCEIROS - isolado */}
        <Route element={<PartnerRoute />}>
          <Route path="/partner-dashboard" element={<PartnerDashboardPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/afiliados" element={<AdminAffiliatesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}