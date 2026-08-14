import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/temoignages")({
  component: () => (
    <CrudManager
      table="testimonials"
      title="Témoignages"
      description="Approuvez les témoignages reçus avant leur publication."
      listPrimary="first_name"
      listSecondary={(r) =>
        `${r["is_approved"] ? "Approuvé" : "En attente"} · ${String(r["content"] ?? "").slice(0, 80)}`
      }
      fields={[
        { name: "first_name", label: "Prénom", type: "text", required: true },
        { name: "content", label: "Témoignage", type: "textarea" },
        { name: "photo_url", label: "Photo", type: "image" },
        { name: "is_approved", label: "Approuvé", type: "boolean" },
      ]}
    />
  ),
});
