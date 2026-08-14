import { createFileRoute } from "@tanstack/react-router";
import communityImage from "@/assets/community.jpg";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Qui sommes-nous ? — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Histoire, mission, vision, spiritualité et valeurs du Renouveau Charismatique Catholique, Groupe de Prière de Zoundja.";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  { title: "Foi", text: "Une confiance vivante en Dieu, nourrie par la Parole et les sacrements." },
  { title: "Prière", text: "La prière personnelle et communautaire au cœur de notre vie." },
  { title: "Fraternité", text: "L'accueil, l'écoute et l'entraide entre tous les membres." },
  { title: "Humilité", text: "Servir dans la simplicité, à la suite du Christ." },
  { title: "Joie", text: "La joie de l'Évangile, signe de la présence de l'Esprit Saint." },
  { title: "Fidélité à l'Église", text: "Une vie communautaire en communion avec la paroisse et le diocèse." },
];

const TIMELINE = [
  { title: "Naissance du groupe", text: "Informations à venir — cette étape sera complétée par les responsables." },
  { title: "Premiers temps de prière", text: "Informations à venir." },
  { title: "Développement des activités", text: "Informations à venir." },
  { title: "Aujourd'hui", text: "Une communauté active, engagée dans la prière et l'évangélisation." },
];

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Notre communauté"
        title="Qui sommes-nous ?"
        description="Le Groupe de Prière de Zoundja est une communauté du Renouveau Charismatique Catholique, au service de la prière, de la fraternité et de l'annonce de l'Évangile."
      />

      <section className="py-20">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={communityImage}
              alt="Membres du groupe de prière réunis"
              loading="lazy"
              width={1280}
              height={960}
              className="w-full rounded-lg object-cover shadow-lift"
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading align="left" eyebrow="Notre histoire" title="Une communauté née de la prière" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Le Groupe de Prière de Zoundja est né du désir de fidèles catholiques de se
                rassembler régulièrement pour prier, louer Dieu et grandir ensemble dans la foi.
              </p>
              <p>
                Au fil des années, la communauté s'est structurée autour de temps de prière
                hebdomadaires, d'enseignements, de temps d'adoration et d'actions
                d'évangélisation.
              </p>
              <p className="text-sm italic">
                Les détails historiques précis seront complétés prochainement par les responsables
                du groupe.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="container-page grid gap-8 md:grid-cols-3">
          {[
            {
              t: "Notre mission",
              d: "Rassembler les fidèles pour la prière, la louange et l'écoute de la Parole, et annoncer l'Évangile autour de nous.",
            },
            {
              t: "Notre vision",
              d: "Une communauté renouvelée par l'Esprit Saint, rayonnante de charité, au service de l'Église locale.",
            },
            {
              t: "Notre spiritualité",
              d: "Une spiritualité catholique, charismatique et mariale : adoration, effusion de l'Esprit, Parole de Dieu et sacrements.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 90}>
              <article className="h-full rounded-lg border border-border bg-card p-8 shadow-soft">
                <h3 className="font-display text-2xl font-semibold text-primary">{c.t}</h3>
                <span className="gold-rule mt-4" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Nos valeurs" title="Ce qui nous unit" />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 80}>
                <div className="h-full rounded-lg border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-primary">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Chronologie" title="Les étapes de notre marche" />
          </Reveal>
          <ol className="mx-auto mt-14 max-w-2xl border-l border-border pl-6">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <li className="relative pb-10">
                  <span className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full bg-accent" />
                  <h3 className="text-lg font-semibold text-primary">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </SiteLayout>
  );
}
