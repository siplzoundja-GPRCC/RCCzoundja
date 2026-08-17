BEGIN;

INSERT INTO public.site_settings (key, value)
VALUES ('site_logo_url', '')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_logo_url_https
  CHECK (
    key <> 'site_logo_url'
    OR value = ''
    OR value ~* '^https://'
  ) NOT VALID;

COMMIT;
