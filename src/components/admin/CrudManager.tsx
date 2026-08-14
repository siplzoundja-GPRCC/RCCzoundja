import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, slugify } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export type FieldType = "text" | "textarea" | "date" | "number" | "boolean" | "select" | "image";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  slugFrom?: string;
};

type Row = Record<string, unknown>;

export function CrudManager({
  table,
  title,
  description,
  fields,
  listPrimary,
  listSecondary,
  orderBy = { column: "created_at", ascending: false },
}: {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  listPrimary: string;
  listSecondary?: (row: Row) => string;
  orderBy?: { column: string; ascending: boolean };
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select("*")
        .order(orderBy.column, { ascending: orderBy.ascending });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin", table] });
    void qc.invalidateQueries();
  };

  const save = useMutation({
    mutationFn: async (payload: Row) => {
      const body: Row = { ...payload };
      for (const f of fields) {
        if (f.slugFrom && !body[f.name]) {
          body[f.name] = `${slugify(String(body[f.slugFrom] ?? ""))}-${Math.random()
            .toString(36)
            .slice(2, 6)}`;
        }
        if (f.type === "boolean") body[f.name] = Boolean(body[f.name]);
        if (body[f.name] === "") body[f.name] = null;
      }
      if (editing) {
        const { error } = await supabase
          .from(table as never)
          .update(body as never)
          .eq("id", editing["id"] as string);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(body as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast.success("Enregistré");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(table as never)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    setEditing(null);
    const initial: Row = {};
    fields.forEach((f) => (initial[f.name] = f.type === "boolean" ? true : ""));
    setForm(initial);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    const initial: Row = {};
    fields.forEach((f) => (initial[f.name] = row[f.name] ?? (f.type === "boolean" ? false : "")));
    setForm(initial);
    setOpen(true);
  }

  async function handleUpload(fieldName: string, file: File) {
    setUploading(fieldName);
    try {
      const url = await uploadMedia(file);
      setForm((f) => ({ ...f, [fieldName]: url }));
      toast.success("Image envoyée");
    } catch {
      toast.error("Envoi de l'image impossible");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-primary">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button onClick={openCreate} variant="gold">
          <Plus className="size-4" /> Ajouter
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? <p className="p-6 text-sm text-muted-foreground">Chargement…</p> : null}
        {!isLoading && (data ?? []).length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Aucun élément pour l'instant.</p>
        ) : null}
        <ul className="divide-y divide-border">
          {(data ?? []).map((row) => (
            <li key={String(row["id"])} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{String(row[listPrimary] ?? "—")}</p>
                {listSecondary ? (
                  <p className="truncate text-xs text-muted-foreground">{listSecondary(row)}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Supprimer définitivement cet élément ?")) {
                      remove.mutate(String(row["id"]));
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier" : "Ajouter"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields
              .filter((f) => !f.slugFrom)
              .map((f) => (
                <div key={f.name}>
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.name}
                      rows={5}
                      className="mt-2"
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  ) : f.type === "boolean" ? (
                    <div className="mt-2 flex items-center gap-3">
                      <Switch
                        id={f.name}
                        checked={Boolean(form[f.name])}
                        onCheckedChange={(v) => setForm({ ...form, [f.name]: v })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {form[f.name] ? "Oui" : "Non"}
                      </span>
                    </div>
                  ) : f.type === "select" ? (
                    <select
                      id={f.name}
                      className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    >
                      <option value="">—</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "image" ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        id={f.name}
                        placeholder="URL de l'image ou du fichier"
                        value={String(form[f.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      />
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-accent">
                        <Upload className="size-4 text-accent" />
                        {uploading === f.name ? "Envoi…" : "Téléverser un fichier"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleUpload(f.name, file);
                          }}
                        />
                      </label>
                      {form[f.name] ? (
                        <img
                          src={String(form[f.name])}
                          alt=""
                          className="h-28 rounded-md border border-border object-cover"
                        />
                      ) : null}
                    </div>
                  ) : (
                    <Input
                      id={f.name}
                      type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                      placeholder={f.placeholder ?? ""}
                      className="mt-2"
                      value={String(form[f.name] ?? "")}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" onClick={() => save.mutate(form)} disabled={save.isPending}>
              {save.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
