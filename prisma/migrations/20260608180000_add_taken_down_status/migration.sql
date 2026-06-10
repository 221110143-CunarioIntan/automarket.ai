-- Add TAKEN_DOWN status to AdStatus enum.
-- TAKEN_DOWN = was previously APPROVED but later removed by admin (moderation).
-- Distinct from REJECTED which means never approved in the first place.
ALTER TYPE "AdStatus" ADD VALUE IF NOT EXISTS 'TAKEN_DOWN';
