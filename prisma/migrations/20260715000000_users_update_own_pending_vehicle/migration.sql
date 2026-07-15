-- Allow users to UPDATE their own vehicle while it is still PENDING, so sellers
-- can fix a listing before admin approval. Once an ad is APPROVED/REJECTED/TAKEN_DOWN
-- it stays locked to the user (admins can still edit via admin_update_vehicles).
--
-- USING restricts which existing rows a user may target (own + currently PENDING).
-- WITH CHECK restricts the resulting row (still own + still PENDING) so a user
-- cannot reassign ownership or self-approve by flipping status in the payload.

GRANT UPDATE ON public.vehicles TO authenticated;

DROP POLICY IF EXISTS "users_update_own_pending_vehicle" ON "vehicles";
CREATE POLICY "users_update_own_pending_vehicle"
    ON "vehicles"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'PENDING')
    WITH CHECK (auth.uid() = user_id AND status = 'PENDING');
