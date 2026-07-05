-- Add nullable whatsapp column. Existing rows stay NULL — they were seeded with
-- placeholder data and shouldn't get contacted by real users.
-- Ads created via the platform must supply a whatsapp number (enforced at form level).

ALTER TABLE "vehicles" ADD COLUMN "whatsapp" TEXT;
