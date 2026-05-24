-- =============================================================================
-- V3 — Add password to users table for authentication
-- =============================================================================

ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';
