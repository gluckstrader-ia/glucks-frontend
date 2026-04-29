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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro API:", errorText);
    throw new Error("Erro ao criar pagamento");
  }

  return response.json();
}