const SOCIAL_HOSTS = {
  facebook: new Set(["facebook.com", "www.facebook.com", "m.facebook.com"]),
  youtube: new Set(["youtube.com", "www.youtube.com", "youtu.be"]),
} as const;

const MAP_EMBED_HOSTS = new Set(["www.google.com", "maps.google.com", "www.openstreetmap.org"]);

export function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function safeSocialUrl(
  value: string | null | undefined,
  provider: keyof typeof SOCIAL_HOSTS,
): string | null {
  const safeUrl = safeHttpsUrl(value);
  if (!safeUrl) return null;

  return SOCIAL_HOSTS[provider].has(new URL(safeUrl).hostname.toLowerCase()) ? safeUrl : null;
}

export function safeMapEmbedUrl(value: string | null | undefined): string | null {
  const safeUrl = safeHttpsUrl(value);
  if (!safeUrl) return null;

  const url = new URL(safeUrl);
  const host = url.hostname.toLowerCase();
  if (!MAP_EMBED_HOSTS.has(host)) return null;

  const isGoogleEmbed = host === "www.google.com" && url.pathname.startsWith("/maps/embed");
  const isGoogleMaps = host === "maps.google.com";
  const isOpenStreetMapEmbed =
    host === "www.openstreetmap.org" && url.pathname.startsWith("/export/embed.html");

  return isGoogleEmbed || isGoogleMaps || isOpenStreetMapEmbed ? safeUrl : null;
}
