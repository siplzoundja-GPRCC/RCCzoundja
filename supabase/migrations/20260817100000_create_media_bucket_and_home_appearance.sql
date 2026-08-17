BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
   SET file_size_limit = 10485760,
       allowed_mime_types = ARRAY[
         'image/jpeg',
         'image/png',
         'image/webp',
         'image/gif',
         'application/pdf',
         'audio/mpeg',
         'audio/ogg',
         'video/mp4'
       ]::text[]
 WHERE id = 'media';

INSERT INTO public.site_settings (key, value) VALUES
  ('home_hero_title', E'Unis dans la prière,\nrenouvelés dans l''Esprit.'),
  ('home_hero_description', 'Une communauté de foi, de prière et de fraternité, rassemblée pour accueillir la présence de Dieu et annoncer l''Évangile.'),
  ('home_hero_image_url', ''),
  ('home_welcome_title', 'Bienvenue dans notre communauté'),
  ('home_welcome_text', E'Notre groupe rassemble des frères et sœurs de tous âges qui désirent vivre une foi vivante, joyeuse et enracinée dans l''Église catholique. Chacun est accueilli tel qu''il est, avec ses joies, ses questions et ses espérances.\n\nEnsemble, nous prions, nous louons, nous nous formons et nous nous soutenons mutuellement. Nous croyons que l''Esprit Saint agit aujourd''hui encore et renouvelle les cœurs.\n\nVous êtes le bienvenu, venez simplement comme vous êtes.'),
  ('home_welcome_image_url', ''),
  ('home_agenda_title', 'Nos prochains rendez-vous'),
  ('home_agenda_image_url', ''),
  ('home_cta_title', 'Venez prier avec nous'),
  ('home_cta_description', E'Que vous soyez de passage ou en recherche d''une communauté, notre porte vous est\ngrande ouverte.')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_home_images_https
  CHECK (
    key NOT IN ('home_hero_image_url', 'home_welcome_image_url', 'home_agenda_image_url')
    OR value = ''
    OR value ~* '^https://'
  ) NOT VALID;

COMMIT;
