import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function RegisterTrialPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Erro no cadastro");
        return;
      }

      // salva auth
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // vai direto para dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("Erro ao conectar com servidor");
    }
  };

  return (
    <div className="min-h-screen bg-[#03070d] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        
        <h1 className="text-2xl font-bold text-white mb-2">
          🎁 Teste grátis por 5 dias
        </h1>

        <p className="text-zinc-400 mb-6 text-sm">
          Crie sua conta e tenha acesso imediato ao sistema
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Seu email"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded bg-zinc-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded transition"
          >
            Começar teste grátis
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-4 text-center">
          Sem compromisso • Cancele quando quiser
        </p>
      </div>
    </div>
  );
}