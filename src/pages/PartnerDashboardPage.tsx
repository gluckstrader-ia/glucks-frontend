import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { clearAuth, getToken } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

type PartnerDashboardData = {
  partner_name: string;
  partner_email: string;
  partner_code: string | null;
  partner_status: string | null;
  total_indications: number;
  total_sales: number;
  total_commission_generated: number;
  total_commission_paid: number;
  total_commission_pending: number;
};

type PartnerIndication = {
  id: number;
  name: string;
  email: string;
  plan: string;
  plan_status: string;
  is_active: boolean;
  is_blocked: boolean;
  has_access: boolean;
  referred_by_code?: string | null;
  created_at?: string | null;
  access_expires_at?: string | null;
};

export default function PartnerDashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<PartnerDashboardData | null>(null);
  const [indications, setIndications] = useState<PartnerIndication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    async function loadPartnerData() {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [dashboardResponse, indicationsResponse] = await Promise.all([
          fetch(`${API_URL}/auth/partner-dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/auth/partner-indications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const dashboardData = await dashboardResponse.json();
        const indicationsData = await indicationsResponse.json();

        if (!dashboardResponse.ok) {
          throw new Error(
            dashboardData.detail || "Erro ao carregar dashboard do parceiro"
          );
        }

        if (!indicationsResponse.ok) {
          throw new Error(
            indicationsData.detail || "Erro ao carregar indicados do parceiro"
          );
        }

        setDashboard(dashboardData);
        setIndications(Array.isArray(indicationsData) ? indicationsData : []);
      } catch (error: any) {
        setError(error.message || "Erro ao carregar dashboard do parceiro");
      } finally {
        setLoading(false);
      }
    }

    loadPartnerData();
  }, [navigate]);

  async function handleCopyCode() {
    if (!dashboard?.partner_code) return;

    try {
      await navigator.clipboard.writeText(dashboard.partner_code);
      setCopySuccess("Código copiado com sucesso!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Não foi possível copiar o código.");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  }

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6">
        <div className="text-zinc-400">Carregando dashboard do parceiro...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard do Parceiro
            </h1>
            <p className="mt-2 text-zinc-400">
              Acompanhe seu código, clientes indicados e comissões.
            </p>
          </div>

          <Button
            onClick={handleLogout}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Sair
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">Indicados</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                {dashboard?.total_indications ?? 0}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">Vendas</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                {dashboard?.total_sales ?? 0}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">Comissão gerada</p>
              <h2 className="mt-2 text-2xl font-black text-emerald-400">
                R$ {(dashboard?.total_commission_generated ?? 0).toFixed(2)}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">Comissão paga</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                R$ {(dashboard?.total_commission_paid ?? 0).toFixed(2)}
              </h2>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-zinc-400">Comissão pendente</p>
              <h2 className="mt-2 text-2xl font-black text-yellow-400">
                R$ {(dashboard?.total_commission_pending ?? 0).toFixed(2)}
              </h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Parceiro</p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {dashboard?.partner_name || "-"}
                </h2>
                <p className="mt-1 text-zinc-400 break-all">
                  {dashboard?.partner_email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Status</p>
                <div className="mt-2 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                  {dashboard?.partner_status || "active"}
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-400">Seu código exclusivo</p>
                <div className="mt-3 text-3xl font-black tracking-wide text-emerald-400">
                  {dashboard?.partner_code || "SEM CÓDIGO"}
                </div>
              </div>

              <Button
                onClick={handleCopyCode}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Copiar código
              </Button>

              {copySuccess && (
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 text-sm text-emerald-400">
                  {copySuccess}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Clientes indicados
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Lista real dos cadastros vinculados ao seu código.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="px-3 py-3">Nome</th>
                      <th className="px-3 py-3">E-mail</th>
                      <th className="px-3 py-3">Plano</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Acesso</th>
                      <th className="px-3 py-3">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-zinc-500">
                          Nenhum indicado encontrado até o momento.
                        </td>
                      </tr>
                    ) : (
                      indications.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-zinc-800/60 text-zinc-200"
                        >
                          <td className="px-3 py-3">{item.name}</td>
                          <td className="px-3 py-3 break-all">{item.email}</td>
                          <td className="px-3 py-3 capitalize">{item.plan}</td>
                          <td className="px-3 py-3">{item.plan_status}</td>
                          <td className="px-3 py-3">
                            {item.has_access ? (
                              <span className="text-emerald-400">Ativo</span>
                            ) : (
                              <span className="text-zinc-400">Sem acesso</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {item.created_at
                              ? new Date(item.created_at).toLocaleString("pt-BR")
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}