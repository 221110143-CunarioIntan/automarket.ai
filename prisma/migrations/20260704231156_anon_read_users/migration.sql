-- Allow anonymous users to read user profiles.
-- Needed so public visitors can see author info on comments
-- (name, role) without logging in.
--
-- Trade-off: any anon can query the users table. For this
-- thesis-scope project it's acceptable since profile fields are
-- minimal (name, email, role). A stricter setup would expose
-- only (id, name, role) via a view.

GRANT SELECT ON "users" TO anon;

DROP POLICY IF EXISTS "anon_read_users" ON "users";
CREATE POLICY "anon_read_users"
    ON "users"
    FOR SELECT
    TO anon
    USING (true);
