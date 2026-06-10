-- Admin can SELECT all vehicles (any status) for moderation queue
DROP POLICY IF EXISTS "admin_read_all_vehicles" ON "vehicles";
CREATE POLICY "admin_read_all_vehicles"
    ON "vehicles"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid() AND "users"."role" = 'ADMIN'
        )
    );

-- Admin can UPDATE vehicles (for approve/reject status changes)
DROP POLICY IF EXISTS "admin_update_vehicles" ON "vehicles";
CREATE POLICY "admin_update_vehicles"
    ON "vehicles"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid() AND "users"."role" = 'ADMIN'
        )
    );

GRANT UPDATE ON public.vehicles TO authenticated;
