package com.dibyajit.terragraphbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single architecture generation session.
 * Contains the user's prompt, generated Terraform code, and
 * the graph structure (nodes + edges) for React Flow rendering.
 */
@Entity
@Table(name = "architecture_sessions", indexes = {
        @Index(name = "idx_session_user",   columnList = "user_id"),
        @Index(name = "idx_session_status", columnList = "status")
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArchitectureSession {

    @Id
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "original_prompt", nullable = false, columnDefinition = "TEXT")
    private String originalPrompt;

    @Column(name = "generated_terraform", columnDefinition = "LONGTEXT")
    private String generatedTerraform;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ── Relationships ────────────────────────────────────────────────────────
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ArchitectureNode> nodes = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NodeEdge> edges = new ArrayList<>();

    // ── Lifecycle Hooks ──────────────────────────────────────────────────────
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (this.createdAt == null) this.createdAt = now;
        if (this.updatedAt == null) this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
