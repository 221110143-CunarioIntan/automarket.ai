-- Drop the legacy denormalized images array column
ALTER TABLE "vehicles" DROP COLUMN IF EXISTS "images";

-- Create the normalized vehicle_images table
CREATE TABLE "vehicle_images" (
    "id"                    UUID           NOT NULL DEFAULT gen_random_uuid(),
    "vehicle_id"            UUID           NOT NULL,
    "order"                 INTEGER        NOT NULL,
    "original_url"          TEXT           NOT NULL,
    "webp_url"              TEXT           NOT NULL,
    "original_size_bytes"   INTEGER,
    "webp_size_bytes"       INTEGER,
    "mime_type"             TEXT,
    "created_at"            TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_images_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vehicle_images_vehicle_id_order_key"
    ON "vehicle_images"("vehicle_id", "order");

CREATE INDEX "vehicle_images_vehicle_id_idx"
    ON "vehicle_images"("vehicle_id");

ALTER TABLE "vehicle_images"
    ADD CONSTRAINT "vehicle_images_vehicle_id_fkey"
    FOREIGN KEY ("vehicle_id")
    REFERENCES "vehicles"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Grant permissions to Supabase roles
GRANT SELECT ON "vehicle_images" TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON "vehicle_images" TO authenticated;

-- Enable Row Level Security
ALTER TABLE "vehicle_images" ENABLE ROW LEVEL SECURITY;

-- Anyone can read images of APPROVED vehicles
CREATE POLICY "public can read images of approved vehicles"
    ON "vehicle_images" FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "vehicle_images"."vehicle_id"
              AND "vehicles"."status" = 'APPROVED'
        )
    );

-- Owners can read all images of their own vehicles (regardless of status)
CREATE POLICY "owners can read their own vehicle images"
    ON "vehicle_images" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "vehicle_images"."vehicle_id"
              AND "vehicles"."user_id" = auth.uid()
        )
    );

-- Owners can insert images for their own vehicles
CREATE POLICY "owners can insert images for their own vehicles"
    ON "vehicle_images" FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "vehicle_images"."vehicle_id"
              AND "vehicles"."user_id" = auth.uid()
        )
    );

-- Owners can delete images for their own vehicles
CREATE POLICY "owners can delete their own vehicle images"
    ON "vehicle_images" FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "vehicles"
            WHERE "vehicles"."id" = "vehicle_images"."vehicle_id"
              AND "vehicles"."user_id" = auth.uid()
        )
    );

-- Admins can read all images (helpful for moderation)
CREATE POLICY "admins can read all vehicle images"
    ON "vehicle_images" FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "users"
            WHERE "users"."id" = auth.uid()
              AND "users"."role" = 'ADMIN'
        )
    );
