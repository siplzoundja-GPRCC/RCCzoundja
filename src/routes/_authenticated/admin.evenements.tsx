import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/evenements")({
  component: () => (
    <CrudManager
      table="events"
      title="Événements"
      description="Veillées, retraites, sessions et rencontres du groupe."
      listPrimary="title"
      listSecondary={(r) => String(r["event_date"] ?? "Date à préciser")}
      orderBy={{ column: "event_date", ascending: false }}
      fields={[
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", slugFrom: "title" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "event_date", label: "Date", type: "date" },
        { name: "event_time", label: "Heure (ex : 18h00)", type: "text" },
        { name: "location", label: "Lieu", type: "text" },
        {
          name: "category",
          label: "Catégorie",
          type: "select",
          options: ["Veillée", "Retraite", "Session", "Enseignement", "Célébration"],
        },
        { name: "image_url", label: "Image", type: "image" },
        { name: "is_published", label: "Publié", type: "boolean" },
      ]}
    />
  ),
});
