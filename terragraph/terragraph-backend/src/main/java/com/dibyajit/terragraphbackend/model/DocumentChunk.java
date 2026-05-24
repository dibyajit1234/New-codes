package com.dibyajit.terragraphbackend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * A single text chunk from a knowledge document, paired with its
 * 1536-dimensional embedding vector for semantic similarity search.
 *
 * The {@code embedding} column uses MySQL 9.0's native VECTOR(1536) type.
 * JPA maps it as a raw String since Hibernate has no built-in VECTOR dialect;
 * the ChunkVectorRepository handles serialization via native queries.
 */
@Entity
@Table(name = "document_chunks", indexes = {
        @Index(name = "idx_chunk_document", columnList = "document_id"),
        @Index(name = "idx_chunk_order",    columnList = "document_id, chunk_index")
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChunk {

    @Id
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private KnowledgeDocument document;

    /** Order of this paragraph within the parent document */
    @Column(name = "chunk_index", nullable = false)
    private int chunkIndex;

    /** The readable text sent to the LLM context window */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * MySQL 9.0 VECTOR(1536) column.
     * Stored as a String representation for JPA compatibility.
     * Native queries in ChunkVectorRepository handle the VECTOR operations.
     */
    @Column(name = "embedding", nullable = false, columnDefinition = "VECTOR(1536)")
    private String embedding;
}
