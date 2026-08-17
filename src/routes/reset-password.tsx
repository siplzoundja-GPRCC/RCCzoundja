import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Réinitialiser le mot de passe — Groupe de Prière de Zoundja" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const emailSchema = z.string().trim().email("Adresse email invalide").max(255);
const passwordSchema = z
  .object({
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(72),
    confirmation: z.string(),
  })
  .refine(({ password, confirmation }) => password === confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [recoverySession, setRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);

  const getAppUrl = () => new URL(import.meta.env.BASE_URL, window.location.origin);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setRecoverySession(Boolean(data.session));
      setCheckingSession(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) setRecoverySession(true);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function requestReset(event: React.FormEvent) {
    event.preventDefault();
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      toast.error(parsedEmail.error.issues[0]?.message ?? "Adresse email invalide");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
      redirectTo: new URL("reset-password", getAppUrl()).toString(),
    });
    setBusy(false);

    if (error) {
      toast.error(error.message === "email rate limit exceeded" ? "Trop de demandes. Réessayez plus tard." : "Impossible d'envoyer l'e-mail de réinitialisation.");
      return;
    }

    // Do not reveal whether an email address is registered.
    toast.success("Si un compte correspond à cette adresse, un lien de réinitialisation a été envoyé.");
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    const parsedPassword = passwordSchema.safeParse({ password, confirmation });
    if (!parsedPassword.success) {
      toast.error(parsedPassword.error.issues[0]?.message ?? "Mot de passe invalide");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsedPassword.data.password });
    setBusy(false);

    if (error) {
      toast.error("Impossible de modifier le mot de passe. Demandez un nouveau lien.");
      return;
    }

    toast.success("Mot de passe modifié. Vous pouvez maintenant accéder à votre espace.");
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

        <h1 className="mt-8 text-3xl font-semibold text-primary">Réinitialiser le mot de passe</h1>

        {checkingSession ? (
          <p className="mt-4 text-sm text-muted-foreground">Vérification du lien…</p>
        ) : recoverySession ? (
          <form onSubmit={changePassword} className="mt-8 space-y-5">
            <p className="text-sm text-muted-foreground">Choisissez votre nouveau mot de passe.</p>
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="mt-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmation">Confirmer le mot de passe</Label>
              <Input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                className="mt-2"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Modification…" : "Enregistrer le nouveau mot de passe"}
            </Button>
          </form>
        ) : (
          <form onSubmit={requestReset} className="mt-8 space-y-5">
            <p className="text-sm text-muted-foreground">
              Saisissez votre adresse email pour recevoir un lien de réinitialisation.
            </p>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Envoi…" : "Recevoir un lien"}
            </Button>
          </form>
        )}

        <Link to="/auth" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
