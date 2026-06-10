-- Postgres-level handling for updated_at columns, since Prisma's @updatedAt
-- is client-side only and INSERTs via Supabase SDK skip it.

-- 1) DEFAULT now() so INSERT without explicit updated_at succeeds.
ALTER TABLE "vehicles" ALTER COLUMN "updated_at" SET DEFAULT now();
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();

-- 2) Trigger to auto-touch updated_at on every UPDATE.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_vehicles_updated_at ON "vehicles";
CREATE TRIGGER touch_vehicles_updated_at
    BEFORE UPDATE ON "vehicles"
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_users_updated_at ON "users";
CREATE TRIGGER touch_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
