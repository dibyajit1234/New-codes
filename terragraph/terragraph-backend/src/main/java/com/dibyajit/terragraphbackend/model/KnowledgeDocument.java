package com.dibyajit.terragraphbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Metadata for an uploaded document in the RAG knowledge base.
 * One document → many text chunks (with embeddings).
 */
@Entity
@Table(name = "knowledge_documents")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeDocument {

    @Id
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    /** e.g., "AWS_DOCUMENTATION", "INTERNAL_SECURITY", "BEST_PRACTICES" */
    @Column(name = "doc_type", nullable = false, length = 100)
    private String docType;

    @Column(name = "author")
    private String author;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    // ── Relationships ────────────────────────────────────────────────────────
    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DocumentChunk> chunks = new ArrayList<>();

    // ── Lifecycle Hooks ──────────────────────────────────────────────────────
    @PrePersist
    protected void onCreate() {
        if (this.uploadedAt == null) {
            this.uploadedAt = LocalDateTime.now();
        }
    }
}
