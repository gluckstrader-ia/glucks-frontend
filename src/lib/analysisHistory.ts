const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export type AnalysisStatus =
  | "GAIN_TOTAL"
  | "GAIN_PARCIAL"
  | "LOSS"
  | "EM_ANDAMENTO";

export type RecentAnalysis = {
  id: number | string;
  asset: string;
  market: string;
  timeframe: string;
  signal: string;
  strength: number;
  status: AnalysisStatus;
  resultLabel: string;
  resultDetail: string;
  createdAt: string | null;
  entry: number;
  stop: number;
  tp1: number;
  tp2: number;
  tp3: number;
};

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchRecentAnalyses(): Promise<RecentAnalysis[]> {
  return fetchJson<RecentAnalysis[]>(`${API_URL}/analysis/recent`);
}

export async function fetchAllAnalyses(): Promise<RecentAnalysis[]> {
  return fetchJson<RecentAnalysis[]>(`${API_URL}/analysis/all`);
}