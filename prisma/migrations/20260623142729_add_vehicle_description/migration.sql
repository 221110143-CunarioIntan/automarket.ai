-- Add optional free-text description to vehicle listings.
-- Nullable: existing rows fall back to the auto-generated description in the UI.

ALTER TABLE "vehicles" ADD COLUMN "description" TEXT;
