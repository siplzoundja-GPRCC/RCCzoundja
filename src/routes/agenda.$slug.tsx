import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useEvent, useSettings, formatDateFr, whatsappLink } from "@/lib/queries";

export const Route = createFileRoute("/agenda/$slug")({
  head: () => ({
    meta: [
      { title: "Événement — Groupe de Prière de Zoundja" },
      { name: "description", content: "Détail d'un événement du Groupe de Prière de Zoundja." },
      { property: "og:title", content: "Événement — Groupe de Prière de Zoundja" },
      { property: "og:description", content: "Détail d'un événement du Groupe de Prière de Zoundja." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const { data: event, isLoading } = useEvent(slug);
  const { data: settings } = useSettings();
  const wa = whatsappLink(
    settings?.["whatsapp_number"],
    `Bonjour, je souhaite participer à : ${event?.title ?? ""}`,
  );

  return (
    <SiteLayout>
      <article className="py-16">
        <div className="container-page max-w-3xl">
          <Link to="/agenda" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="size-4" /> Retour à l'agenda
          </Link>

          {isLoading ? <p className="mt-10 text-muted-foreground">Chargement…</p> : null}
          {!isLoading && !event ? (
            <p className="mt-10 text-muted-foreground">Cet événement est introuvable.</p>
          ) : null}

          {event ? (
            <>
              {event.category ? <p className="eyebrow mt-8">{event.category}</p> : null}
              <h1 className="mt-3 text-4xl font-semibold text-primary">{event.title}</h1>
              <span className="gold-rule mt-5" />
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" /> {formatDateFr(event.event_date)}
                </li>
                {event.event_time ? (
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 text-accent" /> {event.event_time}
                  </li>
                ) : null}
                {event.location ? (
                  <li className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent" /> {event.location}
                  </li>
                ) : null}
              </ul>

              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  loading="lazy"
                  className="mt-8 w-full rounded-lg object-cover shadow-soft"
                />
              ) : null}

              <div className="mt-8 space-y-4 leading-relaxed whitespace-pre-line text-muted-foreground">
                {event.description}
              </div>

              <div className="mt-10">
                {wa ? (
                  <Button asChild variant="gold" size="lg">
                    <a href={wa} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4" /> Je souhaite participer
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="gold" size="lg">
                    <Link to="/contact">Je souhaite participer</Link>
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
