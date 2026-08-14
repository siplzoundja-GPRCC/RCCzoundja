import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/activites")({
  component: () => (
    <CrudManager
      table="activities"
      title="Activités"
      description="Les rendez-vous réguliers du groupe (prière, adoration, formation…)."
      listPrimary="title"
      listSecondary={(r) => String(r["schedule"] ?? "")}
      orderBy={{ column: "sort_order", ascending: true }}
      fields={[
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "schedule", label: "Horaire", type: "text", placeholder: "Mardi à 18h00" },
        {
          name: "icon",
          label: "Icône",
          type: "select",
          options: ["flame", "book", "heart", "music", "users", "hand", "sun", "cross"],
        },
        { name: "sort_order", label: "Ordre d'affichage", type: "number" },
        { name: "is_visible", label: "Visible", type: "boolean" },
      ]}
    />
  ),
});
