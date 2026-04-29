import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerCode, setPartnerCode] = useState("");

  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FORMATAR TELEFONE
  // =========================
  const onlyNumbers = (value: string) => value.replace(/\D/g, "");

  const formatPhone = (value: string) => {
    const numbers = onlyNumbers(value).slice(0, 11);

    if (numbers.length <= 2) return numbers;

    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;

    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  // =========================
  // VALIDAR TELEFONE
  // =========================
  const isValidPhone = (value: string) => {
    const phone = onlyNumbers(value);

    if (![10, 11].includes(phone.length)) return false;

    if (/^(\d)\1+$/.test(phone)) return false;

    const fakeNumbers = [
      "0000000000",
      "9999999999",
      "00000000000",
      "99999999999",
      "1234567890",
      "12345678901",
    ];

    if (fakeNumbers.includes(phone)) return false;

    if (phone.length === 11 && phone[2] !== "9") return false;

    return true;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setPhoneError("");

    if (!name.trim()) return setError("Informe seu nome");
    if (!email.trim()) return setError("Informe seu email");
    if (!password.trim()) return setError("Informe sua senha");

    if (!isValidPhone(phone)) {
      setPhoneError("Digite um WhatsApp válido com DDD");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        phone: onlyNumbers(phone),
        referred_by_code: partnerCode || null,
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao cadastrar");
      }

      localStorage.setItem("glucks_token", data.access_token);
      localStorage.setItem("glucks_user", JSON.stringify(data.user));

      navigate("/home-premium");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-white/10"
      >
        <h1 className="text-2xl font-bold text-white mb-6">
          Criar Conta
        </h1>

        {/* NOME */}
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        {/* SENHA */}
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        {/* TELEFONE */}
        <input
          type="text"
          placeholder="WhatsApp (11) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          className={`w-full mb-2 px-4 py-3 rounded-xl text-white ${
            phoneError
              ? "border-red-500 bg-red-500/10"
              : "border border-white/10 bg-white/5"
          }`}
        />

        {phoneError && (
          <p className="text-red-400 text-sm mb-3">{phoneError}</p>
        )}

        {/* CÓDIGO PARCEIRO */}
        <input
          type="text"
          placeholder="Código de parceiro (opcional)"
          value={partnerCode}
          onChange={(e) => setPartnerCode(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
        />

        {/* ERRO */}
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition"
        >
          {loading ? "Criando..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
}