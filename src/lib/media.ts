import { supabase } from "@/integrations/supabase/client";
import { safeHttpsUrl } from "@/lib/urls";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
const MAX_MEDIA_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
  "audio/mpeg": ["mp3"],
  "audio/ogg": ["ogg"],
  "video/mp4": ["mp4"],
};

/** Uploads a file to the media bucket and returns a long-lived URL. */
export async function uploadMedia(file: File): Promise<string> {
  if (file.size <= 0 || file.size > MAX_MEDIA_SIZE_BYTES) {
    throw new Error("Le fichier doit peser au maximum 10 Mo.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = ALLOWED_MEDIA_TYPES[file.type];
  if (!ext || !allowedExtensions?.includes(ext)) {
    throw new Error("Type de fichier non autorisé.");
  }

  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("URL introuvable");
  const safeUrl = safeHttpsUrl(data.signedUrl);
  if (!safeUrl) throw new Error("URL de média non sécurisée.");
  return safeUrl;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}
