import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTestimonials, formatDateFr } from "@/lib/queries";

const TITLE = "Témoignages — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Témoignages de membres du groupe de prière : ce que Dieu accomplit dans la vie de la communauté.";

export const Route = createFileRoute("/temoignages")({
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
  component: Testimonials,
});

const schema = z.object({
  first_name: z.string().trim().min(2, "Votre prénom est requis").max(60),
  content: z.string().trim().min(20, "Merci d'écrire au moins quelques phrases").max(2000),
});

function Testimonials() {
  const { data } = useTestimonials();
  const [firstName, setFirstName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ first_name: firstName, content });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("testimonials").insert({ ...parsed.data, is_approved: false });
    setSending(false);
    if (error) {
      toast.error("Envoi impossible pour le moment. Merci de réessayer.");
      return;
    }
    setFirstName("");
    setContent("");
    toast.success("Merci ! Votre témoignage sera publié après validation.");
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Témoignages"
        title="Ce que Dieu fait dans nos vies"
        description="Des frères et sœurs partagent ce que le Seigneur a accompli pour eux."
      />

      <section className="py-16">
        <div className="container-page">
          {(data ?? []).length === 0 ? (
            <p className="text-muted-foreground">
              Les premiers témoignages seront publiés prochainement.
            </p>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 70}>
                <figure className="h-full rounded-lg border border-border bg-card p-7 shadow-soft">
                  {t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.first_name}
                      loading="lazy"
                      className="mb-4 size-14 rounded-full object-cover"
                    />
                  ) : null}
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
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="container-page max-w-2xl">
          <SectionHeading
            eyebrow="Partager"
            title="Déposer un témoignage"
            subtitle="Votre message sera lu par les responsables avant publication."
          />
          <form onSubmit={submit} className="mt-10 space-y-5 rounded-lg border border-border bg-card p-7">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={60}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Votre témoignage</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={6}
                className="mt-2"
                required
              />
            </div>
            <Button type="submit" variant="gold" disabled={sending}>
              {sending ? "Envoi…" : "Envoyer mon témoignage"}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
