import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Facebook, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePost, formatDateFr } from "@/lib/queries";

export const Route = createFileRoute("/actualites/$slug")({
  head: () => ({
    meta: [
      { title: "Actualité — Groupe de Prière de Zoundja" },
      { name: "description", content: "Article publié par le Groupe de Prière de Zoundja." },
      { property: "og:title", content: "Actualité — Groupe de Prière de Zoundja" },
      { property: "og:description", content: "Article publié par le Groupe de Prière de Zoundja." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = usePost(slug);
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <SiteLayout>
      <article className="py-16">
        <div className="container-page max-w-3xl">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Retour aux actualités
          </Link>

          {isLoading ? <p className="mt-10 text-muted-foreground">Chargement…</p> : null}
          {!isLoading && !post ? (
            <p className="mt-10 text-muted-foreground">Cet article est introuvable.</p>
          ) : null}

          {post ? (
            <>
              <p className="eyebrow mt-8">{post.category ?? "Actualité"}</p>
              <h1 className="mt-3 text-4xl font-semibold text-primary">{post.title}</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {formatDateFr(post.published_at)}
                {post.author ? ` · par ${post.author}` : ""}
              </p>
              <span className="gold-rule mt-5" />

              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  loading="lazy"
                  className="mt-8 w-full rounded-lg object-cover shadow-soft"
                />
              ) : null}

              <div className="mt-8 leading-relaxed whitespace-pre-line text-foreground/85">
                {post.content}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                <span className="text-sm text-muted-foreground">Partager :</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent"
                >
                  <MessageCircle className="size-4 text-accent" /> WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-accent"
                >
                  <Facebook className="size-4 text-accent" /> Facebook
                </a>
              </div>
            </>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
