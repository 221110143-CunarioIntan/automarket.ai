-- Allow authenticated users to INSERT vehicles + SELECT their own listings
-- (in addition to public SELECT for APPROVED)

GRANT INSERT ON public.vehicles TO authenticated;

-- User can INSERT vehicle as long as user_id matches their auth.uid()
DROP POLICY IF EXISTS "users_insert_own_vehicle" ON "vehicles";
CREATE POLICY "users_insert_own_vehicle"
    ON "vehicles"
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- User can SELECT their own vehicles (any status) for /my-iklan page
DROP POLICY IF EXISTS "users_read_own_vehicles" ON "vehicles";
CREATE POLICY "users_read_own_vehicles"
    ON "vehicles"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
