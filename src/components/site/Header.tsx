import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/queries";
import { safeHttpsUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { to: "/activites", label: "Nos activités" },
  { to: "/agenda", label: "Agenda" },
  { to: "/actualites", label: "Actualités" },
  { to: "/ressources", label: "Ressources" },
  { to: "/galerie", label: "Galerie" },
  { to: "/temoignages", label: "Témoignages" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSettings();
  const logoUrl = safeHttpsUrl(settings?.["site_logo_url"]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo du Groupe de Prière de Zoundja"
              className="size-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-accent">
              <Flame className="size-5" />
            </span>
          )}
          <span className="leading-tight">
            <span className="block font-display text-[0.78rem] font-semibold tracking-[0.16em] text-primary uppercase sm:text-sm">
              Renouveau Charismatique
            </span>
            <span className="block text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
              Groupe de prière de Zoundja
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-[0.8rem] font-medium tracking-wide text-foreground/80 uppercase transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="gold" className="hidden sm:inline-flex">
            <Link to="/contact" hash="rejoindre">
              Nous rejoindre
            </Link>
          </Button>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-primary xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background transition-[max-height] duration-300 xl:hidden",
          open ? "max-h-[36rem]" : "max-h-0",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium tracking-wide text-foreground/85 uppercase"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="gold" className="mt-3">
            <Link to="/contact" hash="rejoindre" onClick={() => setOpen(false)}>
              Nous rejoindre
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
