package com.dibyajit.terragraphbackend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Represents a directed connection between two architecture nodes.
 * Maps to an animated edge in the React Flow graph.
 */
@Entity
@Table(name = "node_edges",
        indexes = @Index(name = "idx_edge_session", columnList = "session_id"),
        uniqueConstraints = @UniqueConstraint(
                name = "uq_edge_direction",
                columnNames = {"source_node_id", "target_node_id"}
        )
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NodeEdge {

    @Id
    @Column(name = "id", nullable = false, updatable = false, length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ArchitectureSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node_id", nullable = false)
    private ArchitectureNode sourceNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node_id", nullable = false)
    private ArchitectureNode targetNode;

    /** e.g., "https-traffic", "vpc-peering", "iam-role" */
    @Column(name = "connection_type", length = 100)
    private String connectionType;

    /** Whether React Flow should animate the connecting line */
    @Column(name = "is_animated", nullable = false)
    @Builder.Default
    private Boolean animated = true;
}
