import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/galerie")({
  component: () => (
    <div className="space-y-14">
      <CrudManager
        table="albums"
        title="Albums photo"
        description="Regroupez les photos par événement ou par thème."
        listPrimary="title"
        listSecondary={(r) => String(r["description"] ?? "")}
        fields={[
          { name: "title", label: "Titre de l'album", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "cover_url", label: "Photo de couverture", type: "image" },
        ]}
      />
      <CrudManager
        table="photos"
        title="Photos"
        description="Téléversez vos photos et associez-les à un album (identifiant de l'album)."
        listPrimary="caption"
        listSecondary={(r) => String(r["image_url"] ?? "")}
        fields={[
          { name: "image_url", label: "Photo", type: "image", required: true },
          { name: "caption", label: "Légende", type: "text" },
          { name: "album_id", label: "Identifiant de l'album", type: "text" },
        ]}
      />
    </div>
  ),
});
