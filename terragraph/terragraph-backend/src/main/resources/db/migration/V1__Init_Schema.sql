-- =============================================================================
-- TerraGraph — V1 Initial Schema
-- MySQL 9.0 with native VECTOR(1536) support for RAG embeddings
-- =============================================================================

-- ===========================================================================
-- 1. USER MANAGEMENT
-- ===========================================================================

CREATE TABLE users (
    id          VARCHAR(36)  NOT NULL PRIMARY KEY,
    username    VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================================================
-- 2. ARCHITECTURE SESSIONS (Parent container for each generation request)
-- ===========================================================================

CREATE TABLE architecture_sessions (
    id                   VARCHAR(36)  NOT NULL PRIMARY KEY,
    user_id              VARCHAR(36)  NOT NULL,
    original_prompt      TEXT         NOT NULL,
    generated_terraform  LONGTEXT              DEFAULT NULL,
    status               VARCHAR(50)  NOT NULL DEFAULT 'DRAFT',
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_session_user    ON architecture_sessions(user_id);
CREATE INDEX idx_session_status  ON architecture_sessions(status);

-- ===========================================================================
-- 3. ARCHITECTURE NODES (Individual cloud services on the canvas)
-- ===========================================================================

CREATE TABLE architecture_nodes (
    id             VARCHAR(36)  NOT NULL PRIMARY KEY,
    session_id     VARCHAR(36)  NOT NULL,
    node_type      VARCHAR(100) NOT NULL,
    label          VARCHAR(255) NOT NULL,
    pos_x          INT          NOT NULL,
    pos_y          INT          NOT NULL,
    node_metadata  JSON                  DEFAULT NULL,

    CONSTRAINT fk_node_session
        FOREIGN KEY (session_id) REFERENCES architecture_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_node_session ON architecture_nodes(session_id);

-- ===========================================================================
-- 4. NODE EDGES (Connections between cloud services)
-- ===========================================================================

CREATE TABLE node_edges (
    id               VARCHAR(36)  NOT NULL PRIMARY KEY,
    session_id       VARCHAR(36)  NOT NULL,
    source_node_id   VARCHAR(36)  NOT NULL,
    target_node_id   VARCHAR(36)  NOT NULL,
    connection_type  VARCHAR(100)          DEFAULT NULL,
    is_animated      BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_edge_session
        FOREIGN KEY (session_id) REFERENCES architecture_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_edge_source
        FOREIGN KEY (source_node_id) REFERENCES architecture_nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_edge_target
        FOREIGN KEY (target_node_id) REFERENCES architecture_nodes(id) ON DELETE CASCADE,

    CONSTRAINT uq_edge_direction UNIQUE (source_node_id, target_node_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_edge_session ON node_edges(session_id);

-- ===========================================================================
-- 5. RAG KNOWLEDGE BASE — Document Metadata
-- ===========================================================================

CREATE TABLE knowledge_documents (
    id           VARCHAR(36)  NOT NULL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    doc_type     VARCHAR(100) NOT NULL,
    author       VARCHAR(255)          DEFAULT NULL,
    uploaded_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================================================
-- 6. RAG KNOWLEDGE BASE — Vector Chunks (MySQL 9.0 VECTOR)
-- ===========================================================================

CREATE TABLE document_chunks (
    id            VARCHAR(36)  NOT NULL PRIMARY KEY,
    document_id   VARCHAR(36)  NOT NULL,
    chunk_index   INT          NOT NULL,
    content       TEXT         NOT NULL,
    embedding     VECTOR(1536) NOT NULL,

    CONSTRAINT fk_chunk_document
        FOREIGN KEY (document_id) REFERENCES knowledge_documents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_chunk_document ON document_chunks(document_id);
CREATE INDEX idx_chunk_order    ON document_chunks(document_id, chunk_index);
