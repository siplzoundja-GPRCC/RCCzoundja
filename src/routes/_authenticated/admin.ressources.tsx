import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/ressources")({
  component: () => (
    <CrudManager
      table="resources"
      title="Ressources"
      description="Prières, enseignements, chants et documents à partager."
      listPrimary="title"
      listSecondary={(r) => String(r["category"] ?? "")}
      fields={[
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "category",
          label: "Catégorie",
          type: "select",
          options: ["Prières", "Enseignements", "Chants", "Documents", "Liens utiles"],
        },
        { name: "file_type", label: "Type", type: "select", options: ["pdf", "lien", "texte"] },
        { name: "file_url", label: "Fichier ou lien", type: "image" },
        { name: "body", label: "Texte intégral (facultatif)", type: "textarea" },
      ]}
    />
  ),
});
