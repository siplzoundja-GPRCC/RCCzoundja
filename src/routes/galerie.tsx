import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useAlbums, usePhotos } from "@/lib/queries";
import { cn } from "@/lib/utils";

const TITLE = "Galerie photos — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Photos des rencontres de prière, formations, camps, évangélisations et célébrations de notre communauté.";

export const Route = createFileRoute("/galerie")({
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
  component: Gallery,
});

function Gallery() {
  const { data: albums } = useAlbums();
  const { data: photos } = usePhotos();
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible = useMemo(
    () => (photos ?? []).filter((p) => !albumId || p.album_id === albumId),
    [photos, albumId],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Galerie"
        title="Nos rencontres en images"
        description="Quelques instants de prière, de joie et de fraternité vécus ensemble."
      />

      <section className="py-16">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAlbumId(null)}
              className={cn(
                "rounded-full border border-border px-4 py-2 text-sm transition-colors",
                albumId === null ? "bg-primary text-primary-foreground" : "hover:border-accent",
              )}
            >
              Toutes les photos
            </button>
            {(albums ?? []).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAlbumId(a.id)}
                className={cn(
                  "rounded-full border border-border px-4 py-2 text-sm transition-colors",
                  albumId === a.id ? "bg-primary text-primary-foreground" : "hover:border-accent",
                )}
              >
                {a.title}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              Aucune photo pour le moment. Les albums seront publiés prochainement.
            </p>
          ) : null}

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60}>
                <button
                  type="button"
                  onClick={() => setLightbox(p.image_url)}
                  className="group block w-full overflow-hidden rounded-lg border border-border bg-card"
                >
                  <img
                    src={p.image_url}
                    alt={p.caption ?? "Photo du groupe de prière"}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            className="absolute top-5 right-5 text-primary-foreground"
            onClick={() => setLightbox(null)}
          >
            <X className="size-7" />
          </button>
          <img src={lightbox} alt="" className="max-h-[88vh] max-w-full rounded-lg object-contain" />
        </div>
      ) : null}
    </SiteLayout>
  );
}
