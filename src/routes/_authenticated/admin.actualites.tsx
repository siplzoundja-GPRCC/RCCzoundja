import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/actualites")({
  component: () => (
    <CrudManager
      table="posts"
      title="Actualités"
      description="Nouvelles, comptes rendus et annonces du groupe de prière."
      listPrimary="title"
      listSecondary={(r) => String(r["published_at"] ?? "")}
      orderBy={{ column: "published_at", ascending: false }}
      fields={[
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", slugFrom: "title" },
        { name: "excerpt", label: "Résumé", type: "textarea" },
        { name: "content", label: "Contenu", type: "textarea" },
        { name: "author", label: "Auteur", type: "text" },
        {
          name: "category",
          label: "Catégorie",
          type: "select",
          options: ["Vie du groupe", "Enseignement", "Témoignage", "Annonce"],
        },
        { name: "published_at", label: "Date de publication", type: "date" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "is_published", label: "Publié", type: "boolean" },
      ]}
    />
  ),
});
