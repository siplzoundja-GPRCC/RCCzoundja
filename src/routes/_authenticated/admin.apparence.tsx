import { createFileRoute } from "@tanstack/react-router";
import { AppearanceManager } from "@/components/admin/AppearanceManager";

export const Route = createFileRoute("/_authenticated/admin/apparence")({
  component: AppearanceManager,
});
