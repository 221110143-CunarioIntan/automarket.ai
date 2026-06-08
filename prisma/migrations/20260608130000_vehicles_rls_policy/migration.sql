-- Enable RLS on vehicles (idempotent — Supabase auto-RLS may have already enabled)
ALTER TABLE "vehicles" ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read APPROVED vehicles.
-- Sufficient for public marketplace browsing.
DROP POLICY IF EXISTS "public_read_approved_vehicles" ON "vehicles";
CREATE POLICY "public_read_approved_vehicles"
    ON "vehicles"
    FOR SELECT
    USING (status = 'APPROVED');
