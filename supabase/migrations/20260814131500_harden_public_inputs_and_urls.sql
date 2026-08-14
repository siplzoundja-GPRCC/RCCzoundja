BEGIN;

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_name_length
    CHECK (char_length(name) BETWEEN 2 AND 100) NOT VALID,
  ADD CONSTRAINT contact_messages_email_length
    CHECK (char_length(email) BETWEEN 3 AND 255) NOT VALID,
  ADD CONSTRAINT contact_messages_phone_length
    CHECK (phone IS NULL OR char_length(phone) <= 40) NOT VALID,
  ADD CONSTRAINT contact_messages_message_length
    CHECK (char_length(message) BETWEEN 10 AND 2000) NOT VALID;

ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_first_name_length
    CHECK (char_length(first_name) BETWEEN 2 AND 60) NOT VALID,
  ADD CONSTRAINT testimonials_content_length
    CHECK (char_length(content) BETWEEN 20 AND 2000) NOT VALID,
  ADD CONSTRAINT testimonials_photo_url_https
    CHECK (photo_url IS NULL OR photo_url ~* '^https://') NOT VALID;

ALTER TABLE public.events
  ADD CONSTRAINT events_image_url_https
    CHECK (image_url IS NULL OR image_url ~* '^https://') NOT VALID;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_image_url_https
    CHECK (image_url IS NULL OR image_url ~* '^https://') NOT VALID;

ALTER TABLE public.albums
  ADD CONSTRAINT albums_cover_url_https
    CHECK (cover_url IS NULL OR cover_url ~* '^https://') NOT VALID;

ALTER TABLE public.photos
  ADD CONSTRAINT photos_image_url_https
    CHECK (image_url ~* '^https://') NOT VALID;

ALTER TABLE public.resources
  ADD CONSTRAINT resources_file_url_https
    CHECK (file_url IS NULL OR file_url ~* '^https://') NOT VALID;

ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_external_urls_https
    CHECK (
      key NOT IN ('facebook_url', 'youtube_url', 'map_embed')
      OR value = ''
      OR value ~* '^https://'
    ) NOT VALID,
  ADD CONSTRAINT site_settings_facebook_url_host
    CHECK (
      key <> 'facebook_url'
      OR value = ''
      OR value ~* '^https://(www\.|m\.)?facebook\.com/'
    ) NOT VALID,
  ADD CONSTRAINT site_settings_youtube_url_host
    CHECK (
      key <> 'youtube_url'
      OR value = ''
      OR value ~* '^https://(www\.)?(youtube\.com|youtu\.be)/'
    ) NOT VALID,
  ADD CONSTRAINT site_settings_map_embed_host
    CHECK (
      key <> 'map_embed'
      OR value = ''
      OR value ~* '^https://(www\.google\.com/maps/embed|maps\.google\.com/|www\.openstreetmap\.org/export/embed\.html)'
    ) NOT VALID;

-- Blocks duplicate public submissions caused by retries or basic replay spam.
-- It deliberately does not use IP data, which PostgREST/Supabase does not expose to RLS.
CREATE OR REPLACE FUNCTION public.reject_rapid_contact_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(lower(NEW.email) || E'\\x1f' || NEW.message, 0));

  IF EXISTS (
    SELECT 1
    FROM public.contact_messages
    WHERE lower(email) = lower(NEW.email)
      AND message = NEW.message
      AND created_at > now() - interval '2 minutes'
  ) THEN
    RAISE EXCEPTION 'Une demande identique a déjà été envoyée récemment.'
      USING ERRCODE = '23505';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_rapid_testimonial_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  IF NEW.is_approved = false THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(lower(NEW.first_name) || E'\\x1f' || NEW.content, 0));

    IF EXISTS (
      SELECT 1
      FROM public.testimonials
      WHERE is_approved = false
        AND lower(first_name) = lower(NEW.first_name)
        AND content = NEW.content
        AND created_at > now() - interval '10 minutes'
    ) THEN
      RAISE EXCEPTION 'Un témoignage identique a déjà été envoyé récemment.'
        USING ERRCODE = '23505';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.reject_rapid_contact_submission() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_rapid_testimonial_submission() FROM PUBLIC;

CREATE TRIGGER contact_messages_reject_rapid_duplicate
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.reject_rapid_contact_submission();

CREATE TRIGGER testimonials_reject_rapid_duplicate
  BEFORE INSERT ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.reject_rapid_testimonial_submission();

COMMIT;
