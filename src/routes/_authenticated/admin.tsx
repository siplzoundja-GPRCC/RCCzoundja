import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Newspaper,
  Sparkles,
  Images,
  BookOpen,
  Quote,
  Settings,
  Mail,
  LogOut,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Groupe de Prière de Zoundja" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/evenements", label: "Événements", icon: CalendarDays },
  { to: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { to: "/admin/activites", label: "Activités", icon: Sparkles },
  { to: "/admin/galerie", label: "Galerie", icon: Images },
  { to: "/admin/ressources", label: "Ressources", icon: BookOpen },
  { to: "/admin/temoignages", label: "Témoignages", icon: Quote },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings, adminOnly: true },
] as const;

function AdminLayout() {
  const { isStaff, isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-10 text-muted-foreground">Chargement de l'espace administrateur…</div>;
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl font-semibold text-primary">Accès réservé</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Votre compte ({user?.email}) n'a pas encore de rôle. Demandez à un administrateur de
            vous accorder l'accès Administrateur ou Éditeur.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild variant="outline">
              <Link to="/">Retour au site</Link>
            </Button>
            <Button
              variant="default"
              onClick={async () => {
                await supabase.auth.signOut();
                void navigate({ to: "/auth" });
              }}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/40 lg:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground lg:min-h-screen lg:w-64 lg:shrink-0">
        <div className="p-6">
          <p className="font-display text-lg font-semibold">Administration</p>
          <p className="mt-1 text-xs tracking-[0.15em] text-sidebar-primary uppercase">
            Zoundja · {isAdmin ? "Administrateur" : "Éditeur"}
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 pb-4 lg:flex-col lg:flex-nowrap">
          {LINKS.filter((l) => !("adminOnly" in l && l.adminOnly) || isAdmin).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l ? l.exact : false }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 px-3 pb-6">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            <Home className="size-4" /> Voir le site
          </Link>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/auth" });
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
          >
            <LogOut className="size-4" /> Se déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
