-- Set Postgres-level DEFAULT for vehicles.id so INSERTs via Supabase SDK
-- (which bypass Prisma's client-side @default(uuid())) auto-generate UUID.
ALTER TABLE "vehicles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
