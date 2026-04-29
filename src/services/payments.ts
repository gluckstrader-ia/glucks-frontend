const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function createCheckout(plan: string, token: string) {
  const response = await fetch(`${API_URL}/payments/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("Erro status:", response.status);
    console.error("Erro resposta completa:", text);

    // tenta converter em JSON
    try {
      const json = JSON.parse(text);
      throw new Error(json?.detail || text);
    } catch {
      throw new Error(text || "Erro ao criar pagamento");
    }
  }

  return text ? JSON.parse(text) : {};
}