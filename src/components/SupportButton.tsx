import { MessageCircle } from "lucide-react";

type SupportButtonProps = {
  whatsappNumber?: string;
  message?: string;
};

export default function SupportButton({
  whatsappNumber = "5551994830003",
  message = "Olá, preciso de suporte na plataforma Gluck’s Trader IA.",
}: SupportButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#0b1220]/95 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-2xl backdrop-blur-md transition hover:scale-[1.02] hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-white"
      aria-label="Abrir suporte no WhatsApp"
      title="Suporte"
    >
      <MessageCircle className="h-5 w-5" />
      <span>Suporte</span>
    </a>
  );
}