import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border/70 bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="container-page max-w-3xl">
        {eyebrow ? (
          <p className="text-xs tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <span className="gold-rule mt-6" />
        {description ? (
          <p className="mt-5 max-w-2xl text-base text-primary-foreground/80">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
