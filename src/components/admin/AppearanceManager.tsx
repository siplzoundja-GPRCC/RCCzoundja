import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/media";
import { safeHttpsUrl } from "@/lib/urls";
import { useSettings } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/hero.jpg";
import communityImage from "@/assets/community.jpg";
import adorationImage from "@/assets/adoration.jpg";

type AppearanceField = {
  key: string;
  label: string;
  help: string;
  type: "text" | "textarea" | "image";
  fallbackImage?: string;
};

const FIELDS = [
  {
    key: "home_hero_title",
    label: "Titre principal",
    help: "Grand texte affiché sur la photo d'accueil.",
    type: "textarea",
  },
  {
    key: "home_hero_description",
    label: "Texte d'accueil",
    help: "Court texte sous le titre de la bannière.",
    type: "textarea",
  },
  {
    key: "home_hero_image_url",
    label: "Photo d'accueil",
    help: "Image de fond derrière le texte d'accueil.",
    type: "image",
    fallbackImage: heroImage,
  },
  {
    key: "home_welcome_title",
    label: "Titre de bienvenue",
    help: "Titre de la section située sous la bannière.",
    type: "text",
  },
  {
    key: "home_welcome_text",
    label: "Texte de bienvenue",
    help: "Séparez les paragraphes par une ligne vide.",
    type: "textarea",
  },
  {
    key: "home_welcome_image_url",
    label: "Photo de bienvenue",
    help: "Image située à gauche du texte de bienvenue.",
    type: "image",
    fallbackImage: communityImage,
  },
  {
    key: "home_agenda_title",
    label: "Titre de l'agenda",
    help: "Titre affiché sur la section sombre Agenda.",
    type: "text",
  },
  {
    key: "home_agenda_image_url",
    label: "Photo de fond de l'agenda",
    help: "Image assombrie derrière les prochains événements.",
    type: "image",
    fallbackImage: adorationImage,
  },
  {
    key: "home_cta_title",
    label: "Titre du bloc Nous rejoindre",
    help: "Grand titre de l'appel final du site.",
    type: "text",
  },
  {
    key: "home_cta_description",
    label: "Texte du bloc Nous rejoindre",
    help: "Texte affiché sous le titre final.",
    type: "textarea",
  },
] as const satisfies readonly AppearanceField[];

type AppearanceKey = (typeof FIELDS)[number]["key"];
type AppearanceValues = Record<AppearanceKey, string>;

const DEFAULT_VALUES: AppearanceValues = {
  home_hero_title: "Unis dans la prière,\nrenouvelés dans l'Esprit.",
  home_hero_description:
    "Une communauté de foi, de prière et de fraternité, rassemblée pour accueillir la présence de Dieu et annoncer l'Évangile.",
  home_hero_image_url: "",
  home_welcome_title: "Bienvenue dans notre communauté",
  home_welcome_text:
    "Notre groupe rassemble des frères et sœurs de tous âges qui désirent vivre une foi vivante, joyeuse et enracinée dans l'Église catholique. Chacun est accueilli tel qu'il est, avec ses joies, ses questions et ses espérances.\n\nEnsemble, nous prions, nous louons, nous nous formons et nous nous soutenons mutuellement. Nous croyons que l'Esprit Saint agit aujourd'hui encore et renouvelle les cœurs.\n\nVous êtes le bienvenu, venez simplement comme vous êtes.",
  home_welcome_image_url: "",
  home_agenda_title: "Nos prochains rendez-vous",
  home_agenda_image_url: "",
  home_cta_title: "Venez prier avec nous",
  home_cta_description:
    "Que vous soyez de passage ou en recherche d'une communauté, notre porte vous est grande ouverte.",
};

export function AppearanceManager() {
  const { data: settings, isLoading } = useSettings();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<AppearanceValues>(DEFAULT_VALUES);
  const [uploading, setUploading] = useState<AppearanceKey | null>(null);

  useEffect(() => {
    if (!settings) return;
    setValues(
      Object.fromEntries(
        FIELDS.map((field) => [field.key, settings[field.key] || DEFAULT_VALUES[field.key]]),
      ) as AppearanceValues,
    );
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      for (const field of FIELDS) {
        if (field.type === "image" && values[field.key] && !safeHttpsUrl(values[field.key])) {
          throw new Error("Les liens d'images doivent utiliser HTTPS.");
        }
      }

      const { error } = await supabase.from("site_settings").upsert(
        FIELDS.map((field) => ({ key: field.key, value: values[field.key].trim() })),
        { onConflict: "key" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Apparence enregistrée");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function upload(field: AppearanceKey, file: File) {
    setUploading(field);
    try {
      const url = await uploadMedia(file);
      setValues((current) => ({ ...current, [field]: url }));
      toast.success("Image téléversée. Pensez à enregistrer les modifications.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Envoi de l'image impossible");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-primary">Apparence de l’accueil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Voici le rendu actuel du site. Modifiez un champ puis enregistrez pour appliquer le
          changement ; laissez une photo vide pour conserver l’image affichée en aperçu.
        </p>
      </div>

      {isLoading ? <p className="mt-8 text-sm text-muted-foreground">Chargement…</p> : null}

      <div className="mt-8 space-y-8">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                rows={field.key === "home_welcome_text" ? 8 : 4}
                className="mt-2"
                value={values[field.key]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.key]: event.target.value }))
                }
              />
            ) : field.type === "image" ? (
              <div className="mt-2 space-y-3">
                <Input
                  id={field.key}
                  placeholder="URL HTTPS de l'image"
                  value={values[field.key]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent">
                  <ImagePlus className="size-4 text-accent" />
                  {uploading === field.key ? "Envoi…" : "Téléverser une image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(field.key, file);
                    }}
                  />
                </label>
                {safeHttpsUrl(values[field.key]) ? (
                  <img
                    src={values[field.key]}
                    alt="Aperçu"
                    className="h-40 w-full rounded-md border border-border object-cover"
                  />
                ) : field.fallbackImage ? (
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Photo actuellement affichée
                    </p>
                    <img
                      src={field.fallbackImage}
                      alt="Photo actuelle du site"
                      className="h-40 w-full rounded-md border border-border object-cover"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <Input
                id={field.key}
                className="mt-2"
                value={values[field.key]}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.key]: event.target.value }))
                }
              />
            )}
          </div>
        ))}
      </div>

      <Button className="mt-8" variant="gold" onClick={() => save.mutate()} disabled={save.isPending}>
        <Save className="size-4" />
        {save.isPending ? "Enregistrement…" : "Enregistrer l’apparence"}
      </Button>
    </div>
  );
}
