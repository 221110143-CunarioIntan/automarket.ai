-- Enable RLS (idempotent — auto-RLS may have already enabled it)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read user profiles (for navbar, seller info, etc.)
DROP POLICY IF EXISTS "authenticated_read_users" ON "users";
CREATE POLICY "authenticated_read_users"
    ON "users"
    FOR SELECT
    TO authenticated
    USING (true);
