-- Create comments table
CREATE TABLE "comments" (
    "id"         UUID          NOT NULL DEFAULT gen_random_uuid(),
    "vehicle_id" UUID          NOT NULL,
    "user_id"    UUID          NOT NULL,
    "parent_id"  UUID,
    "depth"      INTEGER       NOT NULL DEFAULT 0,
    "content"    TEXT          NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "comments_depth_check" CHECK ("depth" BETWEEN 0 AND 2),
    CONSTRAINT "comments_content_length_check" CHECK (char_length("content") BETWEEN 1 AND 1000)
);

CREATE INDEX "comments_vehicle_id_created_at_idx"
    ON "comments"("vehicle_id", "created_at");
CREATE INDEX "comments_parent_id_idx"
    ON "comments"("parent_id");

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_vehicle_id_fkey"
    FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_parent_id_fkey"
    FOREIGN KEY ("parent_id") REFERENCES "comments"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Auto-update updated_at trigger
CREATE TRIGGER "comments_touch_updated_at"
    BEFORE UPDATE ON "comments"
    FOR EACH ROW
    EXECUTE FUNCTION touch_updated_at();

-- Grants
GRANT SELECT ON "comments" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON "comments" TO authenticated;

-- Enable RLS
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;

-- Public read comments on APPROVED vehicles
CREATE POLICY "public read comments on approved vehicles"
    ON "comments" FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "comments"."vehicle_id"
              AND "vehicles"."status" = 'APPROVED'
        )
    );

-- Vehicle owner reads all comments on their vehicles (any status)
CREATE POLICY "vehicle owner reads comments"
    ON "comments" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "comments"."vehicle_id"
              AND "vehicles"."user_id" = auth.uid()
        )
    );

-- Author always reads own comments
CREATE POLICY "author reads own comments"
    ON "comments" FOR SELECT
    TO authenticated
    USING ("user_id" = auth.uid());

-- Admin reads all comments
CREATE POLICY "admin reads all comments"
    ON "comments" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
              AND "users"."role" = 'ADMIN'
        )
    );

-- INSERT: authenticated + own user_id + valid depth
CREATE POLICY "authenticated can insert own comments"
    ON "comments" FOR INSERT
    TO authenticated
    WITH CHECK (
        "user_id" = auth.uid()
        AND "depth" BETWEEN 0 AND 2
    );

-- UPDATE: only author or admin can update (for soft delete)
CREATE POLICY "author or admin can update"
    ON "comments" FOR UPDATE
    TO authenticated
    USING (
        "user_id" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
              AND "users"."role" = 'ADMIN'
        )
    );

-- DELETE: admin only (for cleanup)
CREATE POLICY "admin can hard delete"
    ON "comments" FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
              AND "users"."role" = 'ADMIN'
        )
    );
