import { createFileRoute } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useActivities } from "@/lib/queries";

const TITLE = "Nos activités — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Groupe de prière, chapelet, adoration, louange, enseignements, évangélisation, formation, jeunes et retraites.";

export const Route = createFileRoute("/activites")({
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
  component: Activities,
});

function Activities() {
  const { data, isLoading } = useActivities();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Vie communautaire"
        title="Nos activités"
        description="Tout au long de l'année, la communauté propose des temps de prière, de formation et de mission ouverts à tous."
      />
      <section className="py-20">
        <div className="container-page">
          {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((a, i) => {
              const Cmp =
                (Icons as unknown as Record<string, Icons.LucideIcon>)[a.icon] ?? Icons.Sparkles;
              return (
                <Reveal key={a.id} delay={(i % 3) * 80}>
                  <article className="h-full rounded-lg border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                      <Cmp className="size-5" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold text-primary">{a.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    {a.schedule ? (
                      <p className="mt-4 text-xs tracking-widest text-accent uppercase">
                        {a.schedule}
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
