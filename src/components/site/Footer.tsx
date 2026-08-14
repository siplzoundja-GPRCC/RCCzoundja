import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { useSettings, whatsappLink } from "@/lib/queries";

const FOOTER_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { to: "/activites", label: "Activités" },
  { to: "/agenda", label: "Agenda" },
  { to: "/ressources", label: "Ressources" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const { data: settings } = useSettings();
  const wa = whatsappLink(settings?.["whatsapp_number"], "Bonjour, je souhaite entrer en contact avec le groupe.");

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-semibold">RENOUVEAU CHARISMATIQUE CATHOLIQUE</h3>
          <p className="mt-1 text-sm tracking-[0.18em] text-accent uppercase">Groupe de prière de Zoundja</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
            Unis dans la prière, renouvelés dans l'Esprit. Une communauté de foi, de fraternité et
            d'évangélisation.
          </p>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.2em] text-accent uppercase">Navigation</h4>
          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.2em] text-accent uppercase">Contact</h4>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {settings?.["address"] || "Informations à venir"}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              {settings?.["phone"] || "Informations à venir"}
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              {settings?.["email"] || "Informations à venir"}
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle className="size-4" />
              </a>
            ) : null}
            {settings?.["facebook_url"] ? (
              <a
                href={settings["facebook_url"]}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 transition-colors hover:border-accent hover:text-accent"
              >
                <Facebook className="size-4" />
              </a>
            ) : null}
            {settings?.["youtube_url"] ? (
              <a
                href={settings["youtube_url"]}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/25 transition-colors hover:border-accent hover:text-accent"
              >
                <Youtube className="size-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-foreground/65 sm:flex-row">
          <p>
            © 2026 Renouveau Charismatique Catholique — Groupe de Prière de Zoundja. Tous droits
            réservés.
          </p>
          <Link to="/auth" className="transition-colors hover:text-accent">
            Espace responsables
          </Link>
        </div>
      </div>
    </footer>
  );
}
