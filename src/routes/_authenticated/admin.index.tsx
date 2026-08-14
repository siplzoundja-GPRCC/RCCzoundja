import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const CARDS = [
  { table: "events", label: "Événements", to: "/admin/evenements" },
  { table: "posts", label: "Actualités", to: "/admin/actualites" },
  { table: "photos", label: "Photos", to: "/admin/galerie" },
  { table: "resources", label: "Ressources", to: "/admin/ressources" },
  { table: "testimonials", label: "Témoignages", to: "/admin/temoignages" },
  { table: "contact_messages", label: "Messages reçus", to: "/admin/messages" },
] as const;

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        CARDS.map(async (c) => {
          const { count } = await supabase
            .from(c.table as never)
            .select("*", { count: "exact", head: true });
          return [c.table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Gérez le contenu du site sans écrire une seule ligne de code.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.table}
            to={c.to}
            className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lift"
          >
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold text-primary">
              {data?.[c.table] ?? "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
