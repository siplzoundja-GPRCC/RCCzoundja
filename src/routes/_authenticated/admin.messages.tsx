import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: Messages,
});

function Messages() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "contact_messages"] });

  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    },
    onSuccess: () => void refresh(),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("contact_messages").delete().eq("id", id);
    },
    onSuccess: () => void refresh(),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-primary">Messages reçus</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Les demandes envoyées depuis le formulaire de contact.
      </p>

      <div className="mt-8 space-y-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Chargement…</p> : null}
        {!isLoading && (data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun message pour le moment.</p>
        ) : null}
        {(data ?? []).map((m) => (
          <article
            key={m.id}
            className={`rounded-lg border p-5 ${m.is_read ? "border-border bg-card" : "border-accent/50 bg-accent/5"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">
                  {m.email}
                  {m.phone ? ` · ${m.phone}` : ""} ·{" "}
                  {new Date(m.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRead.mutate({ id: m.id, is_read: !m.is_read })}
                >
                  {m.is_read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove.mutate(m.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-line text-muted-foreground">{m.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
