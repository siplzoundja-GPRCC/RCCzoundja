import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/parametres")({
  component: () => (
    <CrudManager
      table="site_settings"
      title="Paramètres du site"
      description="Coordonnées, WhatsApp, réseaux sociaux et textes affichés sur le site."
      listPrimary="key"
      listSecondary={(r) => String(r["value"] ?? "")}
      orderBy={{ column: "key", ascending: true }}
      fields={[
        { name: "key", label: "Clé", type: "text", required: true },
        { name: "value", label: "Valeur", type: "textarea" },
      ]}
    />
  ),
});
