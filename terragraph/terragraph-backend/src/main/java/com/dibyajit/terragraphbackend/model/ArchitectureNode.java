package com.dibyajit.terragraphbackend.model;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.HashMap;
import java.util.Map;

/**
 * Represents a single cloud service node on the React Flow canvas.
 * Maps to a box in the architecture diagram (e.g., EC2, RDS, S3).
 */
@Entity
@Table(name = "architecture_nodes", indexes = {
        @Index(name = "idx_node_session", columnList = "session_id")
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArchitectureNode {

    @Id
    @Column(name = "id", nullable = false, updatable = false, length = 100)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ArchitectureSession session;

    /** e.g., "aws-ec2", "aws-rds", "aws-s3", "aws-vpc" */
    @Column(name = "node_type", nullable = false, length = 100)
    private String nodeType;

    /** Human-readable label: "Web Server", "Main Database" */
    @Column(name = "label", nullable = false)
    private String label;

    /** React Flow canvas X coordinate */
    @Column(name = "pos_x", nullable = false)
    private int posX;

    /** React Flow canvas Y coordinate */
    @Column(name = "pos_y", nullable = false)
    private int posY;

    /** Arbitrary key-value config: {"instance_type": "t3.micro", "encrypted": true} */
    @Type(JsonType.class)
    @Column(name = "node_metadata", columnDefinition = "JSON")
    @Builder.Default
    private Map<String, Object> nodeMetadata = new HashMap<>();
}
