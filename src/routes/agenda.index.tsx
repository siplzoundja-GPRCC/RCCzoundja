import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useEvents, formatDateFr } from "@/lib/queries";

const TITLE = "Agenda — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Retrouvez les prochains temps de prière, veillées, retraites et rencontres du Groupe de Prière de Zoundja.";

export const Route = createFileRoute("/agenda/")({
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
  component: Agenda,
});

function Agenda() {
  const { data, isLoading } = useEvents();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Agenda"
        title="Nos prochains événements"
        description="Temps de prière, veillées, formations et rassemblements : tous nos rendez-vous à venir."
      />
      <section className="py-20">
        <div className="container-page">
          {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}
          {!isLoading && (data ?? []).length === 0 ? (
            <p className="text-muted-foreground">
              Aucun événement publié pour le moment. Informations à venir.
            </p>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((e, i) => (
              <Reveal key={e.id} delay={(i % 3) * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} loading="lazy" className="h-48 w-full object-cover" />
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    {e.category ? <p className="eyebrow">{e.category}</p> : null}
                    <h2 className="mt-2 text-xl font-semibold text-primary">{e.title}</h2>
                    <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-accent" /> {formatDateFr(e.event_date)}
                      </li>
                      {e.event_time ? (
                        <li className="flex items-center gap-2">
                          <Clock className="size-4 text-accent" /> {e.event_time}
                        </li>
                      ) : null}
                      {e.location ? (
                        <li className="flex items-center gap-2">
                          <MapPin className="size-4 text-accent" /> {e.location}
                        </li>
                      ) : null}
                    </ul>
                    <Link
                      to="/agenda/$slug"
                      params={{ slug: e.slug }}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
                    >
                      En savoir plus <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
