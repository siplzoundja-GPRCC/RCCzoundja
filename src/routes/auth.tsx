import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace responsables — Groupe de Prière de Zoundja" },
      { name: "description", content: "Connexion réservée aux responsables du groupe de prière." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Espace responsables" },
      { property: "og:description", content: "Connexion réservée aux responsables du groupe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      setBusy(false);
      if (error) {
        toast.error("Identifiants incorrects.");
        return;
      }
      void navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        ...parsed.data,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Compte créé. Vérifiez votre email si une confirmation est demandée.");
      void navigate({ to: "/admin" });
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Connexion Google impossible.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lift">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-accent">
            <Flame className="size-5" />
          </span>
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Groupe de prière de Zoundja
          </span>
        </Link>

        <h1 className="mt-8 text-3xl font-semibold text-primary">
          {mode === "signin" ? "Espace responsables" : "Créer un compte"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accès réservé aux responsables et éditeurs du groupe.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Veuillez patienter…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>

        <Button type="button" variant="outline" className="mt-3 w-full" onClick={google}>
          Continuer avec Google
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Créer un compte" : "J'ai déjà un compte"}
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary"
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}
