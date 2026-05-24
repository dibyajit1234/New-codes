-- =============================================================================
-- V2 — Widen ID columns for architecture_nodes and node_edges
-- The LLM generates short IDs like "s3", "alb". We prefix them with the
-- session UUID to ensure global uniqueness, so the column must be wider
-- than the original 36-char UUID constraint.
-- =============================================================================

-- Widen architecture_nodes.id
ALTER TABLE architecture_nodes MODIFY COLUMN id VARCHAR(100) NOT NULL;

-- Widen node_edges.id and FK columns that reference architecture_nodes.id
ALTER TABLE node_edges MODIFY COLUMN id VARCHAR(100) NOT NULL;
ALTER TABLE node_edges MODIFY COLUMN source_node_id VARCHAR(100) NOT NULL;
ALTER TABLE node_edges MODIFY COLUMN target_node_id VARCHAR(100) NOT NULL;
