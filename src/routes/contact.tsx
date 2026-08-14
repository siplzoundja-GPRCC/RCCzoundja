import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettings, whatsappLink } from "@/lib/queries";

const TITLE = "Contact — Groupe de Prière de Zoundja";
const DESCRIPTION =
  "Contactez le Renouveau Charismatique Catholique, Groupe de Prière de Zoundja : téléphone, WhatsApp, adresse et horaires des rencontres.";

export const Route = createFileRoute("/contact")({
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
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Votre nom est requis").max(100),
  email: z.string().trim().email("Adresse email invalide").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Merci de détailler votre message").max(2000),
});

function Contact() {
  const { data: settings } = useSettings();
  const wa = whatsappLink(settings?.["whatsapp_number"], "Bonjour, je souhaite rejoindre le groupe de prière.");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      toast.error("Envoi impossible pour le moment. Merci de réessayer.");
      return;
    }
    setForm({ name: "", email: "", phone: "", message: "" });
    toast.success("Merci ! Votre message a bien été transmis aux responsables.");
  }

  const info = [
    { icon: Phone, label: "Téléphone", value: settings?.["phone"] || "Informations à venir" },
    { icon: Mail, label: "Email", value: settings?.["email"] || "Informations à venir" },
    { icon: MapPin, label: "Adresse", value: settings?.["address"] || "Informations à venir" },
    {
      icon: Clock,
      label: "Horaires des rencontres",
      value: settings?.["meeting_schedule"] || "Informations à venir",
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Nous contacter"
        description="Une question, une intention de prière, l'envie de nous rejoindre ? Écrivez-nous."
      />

      <section className="py-16" id="rejoindre">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Coordonnées" title="Rester en lien" />
            <ul className="mt-8 space-y-5">
              {info.map((c) => (
                <li key={c.label} className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs tracking-widest text-muted-foreground uppercase">
                      {c.label}
                    </p>
                    <p className="mt-0.5 text-base text-foreground">{c.value}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              {wa ? (
                <Button asChild variant="gold" size="lg">
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-4" /> Nous écrire sur WhatsApp
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Numéro WhatsApp : informations à venir.
                </p>
              )}
              {settings?.["facebook_url"] ? (
                <Button asChild variant="outline" size="lg">
                  <a href={settings["facebook_url"]} target="_blank" rel="noreferrer">
                    <Facebook className="size-4" /> Facebook
                  </a>
                </Button>
              ) : null}
              {settings?.["youtube_url"] ? (
                <Button asChild variant="outline" size="lg">
                  <a href={settings["youtube_url"]} target="_blank" rel="noreferrer">
                    <Youtube className="size-4" /> YouTube
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <form
              onSubmit={submit}
              className="space-y-5 rounded-lg border border-border bg-card p-7 shadow-soft"
            >
              <h2 className="font-display text-2xl font-semibold text-primary">
                Envoyer un message
              </h2>
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  className="mt-2"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  className="mt-2"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  className="mt-2"
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="default" disabled={sending}>
                {sending ? "Envoi…" : "Envoyer le message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <SectionHeading eyebrow="Localisation" title="Nous trouver à Zoundja" />
          <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
            {settings?.["map_embed"] ? (
              <iframe
                title="Carte de localisation du groupe de prière"
                src={settings["map_embed"]}
                loading="lazy"
                className="h-[420px] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
                <MapPin className="size-7 text-accent" />
                <p className="text-muted-foreground">
                  Carte interactive à venir — les coordonnées exactes seront ajoutées par les
                  responsables.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
