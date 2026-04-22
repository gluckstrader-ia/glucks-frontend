import { getStoredToken } from "./auth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export type LiveRoomSignal = "buy" | "sell" | "neutral" | "wait";

export interface LiveRoomResponse {
  asset: string;
  timeframe: string;
  price: number;
  signal: LiveRoomSignal;
  confidence: number;
  market_regime: string;
  narration_text: string;
  entry: number | null;
  stop: number | null;
  target_1: number | null;
  target_2: number | null;
  risk_reward: number | null;
  events: string[];
  alerts: {
    type:
      | "entry_alert"
      | "stop_threat"
      | "target_near"
      | "direction_change"
      | "strengthening"
      | "weakening"
      | "neutral";
    title: string;
    message: string;
    priority: number;
  }[];
  scenario_memory: {
    previous_signal: LiveRoomSignal | null;
    current_signal: LiveRoomSignal;
    changed: boolean;
    previous_confidence: number | null;
    current_confidence: number;
    confidence_delta: number;
    evolution_label: string;
  };
  state_flags: {
    above_vwap: boolean;
    trend_up: boolean;
    trend_down: boolean;
    lateralized: boolean;
    exhaustion: boolean;
  };
  updated_at: string;
}

function buildAuthHeaders(): HeadersInit {
  const token = getStoredToken();

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchLiveRoomAnalysis(
  asset: string,
  timeframe = "5m"
): Promise<LiveRoomResponse> {
  const response = await fetch(
    `${API_URL}/live-room/analyze?asset=${encodeURIComponent(asset)}&timeframe=${encodeURIComponent(timeframe)}`,
    {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar Sala ao Vivo IA.");
  }

  return data;
}

export async function fetchLiveRoomVoice(text: string): Promise<string> {
  const response = await fetch(`${API_URL}/live-room/voice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Erro ao gerar voz premium.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}