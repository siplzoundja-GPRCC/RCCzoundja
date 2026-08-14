import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, FileText } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useResources, formatDateFr } from "@/lib/queries";
import { cn } from "@/lib/utils";

const TITLE = "Ressources spirituelles — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Prières, enseignements, e-books, documents PDF, audios, vidéos et lectures spirituelles à télécharger ou consulter.";

export const CATEGORIES = [
  "Prières",
  "Enseignements",
  "E-books",
  "Documents PDF",
  "Audios",
  "Vidéos",
  "Lectures spirituelles",
];

export const Route = createFileRoute("/ressources")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Resources,
});

function Resources() {
  const { data } = useResources();
  const [cat, setCat] = useState<string | null>(null);
  const list = useMemo(() => (data ?? []).filter((r) => !cat || r.category === cat), [data, cat]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ressources"
        title="Ressources spirituelles"
        description="Pour nourrir la prière personnelle et approfondir la foi tout au long de la semaine."
      />
      <section className="py-16">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCat(null)}
              className={cn(
                "rounded-full border border-border px-4 py-2 text-sm transition-colors",
                cat === null ? "bg-primary text-primary-foreground" : "hover:border-accent",
              )}
            >
              Toutes
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border border-border px-4 py-2 text-sm transition-colors",
                  cat === c ? "bg-primary text-primary-foreground" : "hover:border-accent",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              Aucune ressource disponible dans cette catégorie pour le moment.
            </p>
          ) : null}

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 70}>
                <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-soft">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                    <FileText className="size-5" />
                  </span>
                  <p className="mt-4 text-xs tracking-widest text-accent uppercase">{r.category}</p>
                  <h2 className="mt-1 text-lg font-semibold text-primary">{r.title}</h2>
                  {r.description ? (
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.description}</p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {r.body ? (
                    <p className="mt-3 border-l-2 border-accent/50 pl-3 text-sm whitespace-pre-line text-foreground/80">
                      {r.body}
                    </p>
                  ) : null}
                  <p className="mt-4 text-xs text-muted-foreground">{formatDateFr(r.created_at)}</p>
                  {r.file_url ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent"
                      >
                        <ExternalLink className="size-4 text-accent" /> Consulter
                      </a>
                      <a
                        href={r.file_url}
                        download
                        className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent"
                      >
                        <Download className="size-4 text-accent" /> Télécharger
                      </a>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
