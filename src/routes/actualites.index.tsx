import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { usePosts, formatDateFr } from "@/lib/queries";

const TITLE = "Actualités — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Annonces, comptes rendus et nouvelles du Renouveau Charismatique Catholique, Groupe de Prière de Zoundja.";

export const Route = createFileRoute("/actualites/")({
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
  component: News,
});

function News() {
  const { data, isLoading } = usePosts();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Actualités"
        title="Les nouvelles de la communauté"
        description="Annonces, comptes rendus de rencontres et informations importantes du groupe."
      />
      <section className="py-20">
        <div className="container-page">
          {isLoading ? <p className="text-muted-foreground">Chargement…</p> : null}
          {!isLoading && (data ?? []).length === 0 ? (
            <p className="text-muted-foreground">Aucune actualité publiée pour le moment.</p>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link
                  to="/actualites/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs tracking-widest text-muted-foreground uppercase">
                      {formatDateFr(p.published_at)}
                      {p.category ? ` · ${p.category}` : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-primary">{p.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
