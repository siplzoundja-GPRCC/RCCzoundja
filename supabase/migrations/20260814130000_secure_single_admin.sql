BEGIN;

LOCK TABLE public.user_roles IN ACCESS EXCLUSIVE MODE;

DO $$
DECLARE
  configured_admin_id uuid;
BEGIN
  SELECT id
    INTO configured_admin_id
    FROM auth.users
   WHERE lower(email) = lower('siplzoundja@gmail.com');

  IF configured_admin_id IS NULL THEN
    RAISE EXCEPTION 'Configured admin account siplzoundja@gmail.com does not exist in auth.users';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM public.user_roles
     WHERE role = 'admin'
       AND user_id <> configured_admin_id
  ) THEN
    RAISE EXCEPTION 'A different admin already exists; refusing to change admin roles';
  END IF;
END;
$$;

CREATE UNIQUE INDEX user_roles_single_admin_idx
  ON public.user_roles (role)
  WHERE role = 'admin';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
  FROM auth.users
 WHERE lower(email) = lower('siplzoundja@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

DROP FUNCTION IF EXISTS public.claim_first_admin();

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;

CREATE POLICY "admins manage editor roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND role = 'editor')
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND role = 'editor');

COMMIT;
