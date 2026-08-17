import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowRight, CalendarDays, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import communityImage from "@/assets/community.jpg";
import adorationImage from "@/assets/adoration.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useActivities, useEvents, usePosts, useSettings, useTestimonials, formatDateFr } from "@/lib/queries";
import { safeHttpsUrl } from "@/lib/urls";

const TITLE = "Renouveau Charismatique Catholique — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Unis dans la prière, renouvelés dans l'Esprit. Une communauté catholique de foi, de prière, de fraternité et d'évangélisation à Zoundja.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const MISSIONS = [
  {
    icon: "HandHeart",
    title: "Prière",
    text: "Nous nous réunissons pour prier, louer Dieu et rechercher sa présence.",
  },
  {
    icon: "Users",
    title: "Fraternité",
    text: "Nous grandissons ensemble dans la foi, l'amour et la communion fraternelle.",
  },
  {
    icon: "Megaphone",
    title: "Évangélisation",
    text: "Nous annonçons l'Évangile et témoignons de l'amour du Christ.",
  },
  {
    icon: "BookOpen",
    title: "Formation",
    text: "Nous approfondissons notre foi à travers les enseignements et la formation chrétienne.",
  },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Cmp className={className} />;
}

function Index() {
  const { data: activities } = useActivities();
  const { data: events } = useEvents(3);
  const { data: posts } = usePosts(3);
  const { data: testimonials } = useTestimonials();
  const { data: settings } = useSettings();
  const text = (key: string, fallback: string) => settings?.[key]?.trim() || fallback;
  const image = (key: string, fallback: string) => safeHttpsUrl(settings?.[key]) ?? fallback;

  const heroTitle = text("home_hero_title", "Unis dans la prière,\nrenouvelés dans l'Esprit.");
  const welcomeText = text(
    "home_welcome_text",
    "Notre groupe rassemble des frères et sœurs de tous âges qui désirent vivre une foi vivante, joyeuse et enracinée dans l'Église catholique. Chacun est accueilli tel qu'il est, avec ses joies, ses questions et ses espérances.\n\nEnsemble, nous prions, nous louons, nous nous formons et nous nous soutenons mutuellement. Nous croyons que l'Esprit Saint agit aujourd'hui encore et renouvelle les cœurs.\n\nVous êtes le bienvenu, venez simplement comme vous êtes.",
  );

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden">
        <img
          src={image("home_hero_image_url", heroImage)}
          alt="Assemblée de fidèles en prière et en louange dans une église"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[var(--gradient-hero)]" />
        <div className="container-page py-24 text-primary-foreground">
          <Reveal className="max-w-3xl rounded-xl bg-primary/65 p-6 shadow-2xl backdrop-blur-[2px] sm:p-10">
            <p className="text-[0.7rem] tracking-[0.32em] text-accent uppercase sm:text-xs">
              Renouveau Charismatique Catholique
            </p>
            <p className="mt-2 text-sm tracking-[0.2em] text-primary-foreground/80 uppercase">
              Groupe de Prière de Zoundja
            </p>
            <h1 className="mt-7 whitespace-pre-line text-4xl leading-[1.08] font-semibold sm:text-6xl">
              {heroTitle}
            </h1>
            <span className="gold-rule mt-7" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              {text(
                "home_hero_description",
                "Une communauté de foi, de prière et de fraternité, rassemblée pour accueillir la présence de Dieu et annoncer l'Évangile.",
              )}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="gold">
                <Link to="/qui-sommes-nous">Découvrir notre groupe</Link>
              </Button>
              <Button asChild size="lg" variant="outlineLight">
                <Link to="/agenda">Nos prochaines activités</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BIENVENUE */}
      <section className="py-20 sm:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src={image("home_welcome_image_url", communityImage)}
                alt="Groupe de prière catholique réuni en cercle"
                loading="lazy"
                width={1280}
                height={960}
                className="w-full rounded-lg object-cover shadow-lift"
              />
              <div className="absolute -right-3 -bottom-6 hidden w-44 rounded-lg bg-primary p-5 text-primary-foreground shadow-lift sm:block">
                <p className="font-display text-lg leading-snug">« Là où deux ou trois sont réunis en mon nom… »</p>
                <p className="mt-2 text-xs text-accent">Mt 18, 20</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              align="left"
              eyebrow="Bienvenue"
              title={text("home_welcome_title", "Bienvenue dans notre communauté")}
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {welcomeText.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <Button asChild variant="default" className="mt-8">
              <Link to="/qui-sommes-nous">
                Notre histoire <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-secondary/60 py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Notre mission"
              title="Quatre piliers qui nous rassemblent"
              subtitle="Notre vie communautaire s'enracine dans la prière et se déploie dans le service et l'annonce de l'Évangile."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MISSIONS.map((m, i) => (
              <Reveal key={m.title} delay={i * 90}>
                <article className="h-full rounded-lg border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                    <Icon name={m.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-primary">{m.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITES */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Nos activités"
              title="La vie du groupe, semaine après semaine"
              subtitle="Prière, adoration, louange, formation et évangélisation : chacun peut trouver sa place."
            />
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(activities ?? []).slice(0, 9).map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 80}>
                <div className="flex h-full items-start gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-accent">
                    <Icon name={a.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to="/activites">
                Toutes nos activités <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <img
          src={image("home_agenda_image_url", adorationImage)}
          alt="Ostensoir doré lors d'un temps d'adoration"
          loading="lazy"
          width={1280}
          height={960}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-primary/88" />
        <div className="container-page text-primary-foreground">
          <Reveal>
            <p className="eyebrow">Agenda</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {text("home_agenda_title", "Nos prochains rendez-vous")}
            </h2>
            <span className="gold-rule mt-5" />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(events ?? []).length === 0 ? (
              <p className="text-primary-foreground/75">
                Les prochains événements seront publiés très bientôt.
              </p>
            ) : (
              (events ?? []).map((e, i) => (
                <Reveal key={e.id} delay={i * 90}>
                  <article className="flex h-full flex-col rounded-lg border border-primary-foreground/15 bg-primary-foreground/8 p-6 backdrop-blur-sm">
                    {e.category ? (
                      <span className="text-[0.65rem] tracking-[0.2em] text-accent uppercase">
                        {e.category}
                      </span>
                    ) : null}
                    <h3 className="mt-2 text-xl font-semibold">{e.title}</h3>
                    <ul className="mt-4 space-y-1.5 text-sm text-primary-foreground/80">
                      <li className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-accent" />
                        {formatDateFr(e.event_date)}
                      </li>
                      {e.event_time ? (
                        <li className="flex items-center gap-2">
                          <Clock className="size-4 text-accent" />
                          {e.event_time}
                        </li>
                      ) : null}
                      {e.location ? (
                        <li className="flex items-center gap-2">
                          <MapPin className="size-4 text-accent" />
                          {e.location}
                        </li>
                      ) : null}
                    </ul>
                    <Link
                      to="/agenda/$slug"
                      params={{ slug: e.slug }}
                      className="mt-6 inline-flex items-center gap-2 text-sm text-accent hover:underline"
                    >
                      En savoir plus <ArrowRight className="size-4" />
                    </Link>
                  </article>
                </Reveal>
              ))
            )}
          </div>
          <div className="mt-10">
            <Button asChild variant="gold">
              <Link to="/agenda">Voir tout l'agenda</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ACTUALITES */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Actualités" title="Les nouvelles du groupe" />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {(posts ?? []).length === 0 ? (
              <p className="text-muted-foreground">Les premières actualités arrivent bientôt.</p>
            ) : (
              (posts ?? []).map((p, i) => (
                <Reveal key={p.id} delay={i * 90}>
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
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs tracking-widest text-muted-foreground uppercase">
                        {formatDateFr(p.published_at)}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-primary">{p.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      {(testimonials ?? []).length > 0 ? (
        <section className="bg-secondary/60 py-20 sm:py-28">
          <div className="container-page">
            <Reveal>
              <SectionHeading eyebrow="Témoignages" title="Ce que Dieu fait dans nos vies" />
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {(testimonials ?? []).slice(0, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <figure className="h-full rounded-lg border border-border bg-card p-7 shadow-soft">
                    <blockquote className="font-display text-lg leading-relaxed text-primary">
                      « {t.content} »
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-muted-foreground">
                      {t.first_name} — {formatDateFr(t.created_at)}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/temoignages">Lire tous les témoignages</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <div className="rounded-lg border border-accent/40 bg-card p-10 text-center shadow-soft sm:p-16">
              <p className="eyebrow">Nous rejoindre</p>
              <h2 className="mt-4 text-3xl font-semibold text-primary sm:text-4xl">
                {text("home_cta_title", "Venez prier avec nous")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
                {text(
                  "home_cta_description",
                  "Que vous soyez de passage ou en recherche d'une communauté, notre porte vous est grande ouverte.",
                )}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/activites">Découvrir les activités</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
