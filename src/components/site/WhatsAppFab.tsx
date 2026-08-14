import { MessageCircle } from "lucide-react";
import { useSettings, whatsappLink } from "@/lib/queries";

export function WhatsAppFab() {
  const { data: settings } = useSettings();
  const href = whatsappLink(
    settings?.["whatsapp_number"],
    "Bonjour, je viens du site du Groupe de Prière de Zoundja.",
  );
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-primary py-3 pr-5 pl-4 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="size-5 text-accent" />
      <span className="hidden sm:inline">Nous contacter sur WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </a>
  );
}
