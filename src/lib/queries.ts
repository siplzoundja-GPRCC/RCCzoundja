import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { safeHttpsUrl, safeMapEmbedUrl, safeSocialUrl } from "@/lib/urls";

export type Settings = Record<string, string>;

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return Object.fromEntries(
        (data ?? []).map((r) => {
          if (r.key === "facebook_url") return [r.key, safeSocialUrl(r.value, "facebook") ?? ""];
          if (r.key === "youtube_url") return [r.key, safeSocialUrl(r.value, "youtube") ?? ""];
          if (r.key === "map_embed") return [r.key, safeMapEmbedUrl(r.value) ?? ""];
          return [r.key, r.value];
        }),
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: ["events", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true, nullsFirst: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((event) => ({ ...event, image_url: safeHttpsUrl(event.image_url) }));
    },
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? { ...data, image_url: safeHttpsUrl(data.image_url) } : null;
    },
  });
}

export function usePosts(limit?: number) {
  return useQuery({
    queryKey: ["posts", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((post) => ({ ...post, image_url: safeHttpsUrl(post.image_url) }));
    },
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data ? { ...data, image_url: safeHttpsUrl(data.image_url) } : null;
    },
  });
}

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((album) => ({ ...album, cover_url: safeHttpsUrl(album.cover_url) }));
    },
  });
}

export function usePhotos() {
  return useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).flatMap((photo) => {
        const imageUrl = safeHttpsUrl(photo.image_url);
        return imageUrl ? [{ ...photo, image_url: imageUrl }] : [];
      });
    },
  });
}

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((resource) => ({ ...resource, file_url: safeHttpsUrl(resource.file_url) }));
    },
  });
}

export function useTestimonials(onlyApproved = true) {
  return useQuery({
    queryKey: ["testimonials", onlyApproved],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (onlyApproved) q = q.eq("is_approved", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((testimonial) => ({
        ...testimonial,
        photo_url: safeHttpsUrl(testimonial.photo_url),
      }));
    },
  });
}

export function formatDateFr(value?: string | null) {
  if (!value) return "Date à venir";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export function whatsappLink(number: string | undefined, message: string) {
  const clean = (number ?? "").replace(/[^0-9]/g, "");
  if (!clean) return null;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
