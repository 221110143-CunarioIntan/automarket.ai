-- Grant minimal access to anon + authenticated roles so PostgREST (Supabase API)
-- can serve vehicle reads. RLS policies still filter rows.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.vehicles TO anon, authenticated;
GRANT SELECT ON public.users TO authenticated;

-- Enums need explicit USAGE for filter expressions (e.g. .eq("type", "CAR"))
GRANT USAGE ON TYPE public."Brand" TO anon, authenticated;
GRANT USAGE ON TYPE public."VehicleType" TO anon, authenticated;
GRANT USAGE ON TYPE public."AdStatus" TO anon, authenticated;
GRANT USAGE ON TYPE public."Role" TO anon, authenticated;
