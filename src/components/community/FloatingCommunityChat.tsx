import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Image,
  Video,
  Users,
  ChevronRight,
} from "lucide-react";

type Channel = "Geral" | "Avisos" | "Forex" | "B3" | "Dúvidas";
type MessageType = "text" | "image" | "video";

type CommunityMessage = {
  id: string | number;
  channel: Channel;
  user_name: string;
  message_type: MessageType;
  content: string;
  media_url?: string | null;
  created_at?: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const CHANNELS: Channel[] = ["Geral", "Avisos", "Forex", "B3", "Dúvidas"];

export default function FloatingCommunityChat({
  token,
  userName,
}: {
  token: string | null;
  userName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<Channel>("Geral");
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("text");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);

  const canSend = useMemo(() => {
    if (messageType === "text") return content.trim().length > 0;
    return content.trim().length > 0 || mediaUrl.trim().length > 0;
  }, [content, mediaUrl, messageType]);

  async function fetchMessages() {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/community/messages?channel=${encodeURIComponent(channel)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      const items = Array.isArray(data) ? data : data?.items ?? [];

      setMessages((prev) => {
        if (!open && items.length > prev.length) {
          setUnread((current) => current + (items.length - prev.length));
        }

        return items;
      });
    } catch (error) {
      console.error("Erro ao buscar mensagens da comunidade:", error);
    }
  }

  async function sendMessage() {
    if (!token || !canSend) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/community/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel,
          message_type: messageType,
          content: content.trim(),
          media_url: mediaUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      setContent("");
      setMediaUrl("");
      setMessageType("text");
      await fetchMessages();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [channel, token, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  if (!token) return null;

  return (
    <div className="fixed left-4 top-1/2 z-[80] -translate-y-1/2">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative flex h-[170px] w-14 flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-zinc-950/95 text-cyan-200 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl transition hover:border-cyan-300 hover:text-white"
        >
          {unread > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-400 px-2 text-xs font-black text-black">
              {unread}
            </span>
          )}

          <MessageCircle className="h-6 w-6" />

          <span className="[writing-mode:vertical-rl] rotate-180 text-xs font-black uppercase tracking-[0.2em]">
            Comunidade
          </span>

          <ChevronRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-1" />
        </button>
      )}

      {open && (
        <section className="h-[78vh] w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-[#070a10]/95 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-black text-white">Comunidade</h2>
                <p className="text-xs text-zinc-400">
                  Converse com outros traders logados
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-400 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
            {CHANNELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  channel === item
                    ? "border-cyan-300 bg-cyan-400 text-black"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="h-[calc(78vh-255px)] space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-zinc-400">
                Nenhuma mensagem ainda em {channel}. Seja o primeiro a postar.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <strong className="text-sm text-white">
                      {message.user_name || "Usuário"}
                    </strong>

                    <span className="text-[11px] text-zinc-500">
                      {message.created_at
                        ? new Date(message.created_at).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </span>
                  </div>

                  {message.content && (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                      {message.content}
                    </p>
                  )}

                  {message.message_type === "image" && message.media_url && (
                    <a
                      href={message.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block overflow-hidden rounded-xl border border-white/10"
                    >
                      <img
                        src={message.media_url}
                        alt="Imagem enviada"
                        className="max-h-64 w-full object-cover"
                      />
                    </a>
                  )}

                  {message.message_type === "video" && message.media_url && (
                    <a
                      href={message.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:text-white"
                    >
                      <Video className="h-4 w-4" />
                      Abrir vídeo
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          <footer className="border-t border-white/10 p-4">
            <div className="mb-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMessageType("text")}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                  messageType === "text"
                    ? "border-cyan-300 bg-cyan-400 text-black"
                    : "border-white/10 text-zinc-400"
                }`}
              >
                Texto
              </button>

              <button
                type="button"
                onClick={() => setMessageType("image")}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                  messageType === "image"
                    ? "border-cyan-300 bg-cyan-400 text-black"
                    : "border-white/10 text-zinc-400"
                }`}
              >
                Imagem
              </button>

              <button
                type="button"
                onClick={() => setMessageType("video")}
                className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                  messageType === "video"
                    ? "border-cyan-300 bg-cyan-400 text-black"
                    : "border-white/10 text-zinc-400"
                }`}
              >
                Vídeo
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Mensagem em ${channel}...`}
              className="mb-2 h-20 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/40"
            />

            {messageType !== "text" && (
              <div className="mb-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2">
                {messageType === "image" ? (
                  <Image className="h-4 w-4 text-cyan-300" />
                ) : (
                  <Video className="h-4 w-4 text-red-300" />
                )}

                <input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={
                    messageType === "image"
                      ? "Cole o link da imagem..."
                      : "Cole o link do vídeo..."
                  }
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </div>
            )}

            <button
              type="button"
              disabled={!canSend || loading}
              onClick={sendMessage}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Enviando..." : "Enviar mensagem"}
            </button>

            <p className="mt-2 text-center text-[11px] text-zinc-600">
              Logado como {userName || "usuário"}
            </p>
          </footer>
        </section>
      )}
    </div>
  );
}