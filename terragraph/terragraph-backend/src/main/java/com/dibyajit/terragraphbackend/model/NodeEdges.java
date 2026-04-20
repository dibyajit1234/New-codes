package com.dibyajit.terragraphbackend.model;

import com.dibyajit.terragraphbackend.model.enums.ConnectionType;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

@Entity
@Table(name = "node_edges")
public class NodeEdges {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "session_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ArchitectureSession sessionId;

    @ManyToOne
    @JoinColumn(name="source_node_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private  ArchitectureNodes sourceNodeId;

    @ManyToOne
    @JoinColumn(name = "targetr_node_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ArchitectureNodes targetNodeId;

    @Column(name = "connection_type")
    private ConnectionType connectionType;

    @Column(name = "is_animated")
    private Boolean isAnimated=true;

    public NodeEdges() {
    }

    public NodeEdges(UUID id, ArchitectureSession sessionId, ArchitectureNodes sourceNodeId, ArchitectureNodes targetNodeId, ConnectionType connectionType, Boolean isAnimated) {
        this.id = id;
        this.sessionId = sessionId;
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.connectionType = connectionType;
        this.isAnimated = isAnimated;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ArchitectureSession getSessionId() {
        return sessionId;
    }

    public void setSessionId(ArchitectureSession sessionId) {
        this.sessionId = sessionId;
    }

    public ArchitectureNodes getSourceNodeId() {
        return sourceNodeId;
    }

    public void setSourceNodeId(ArchitectureNodes sourceNodeId) {
        this.sourceNodeId = sourceNodeId;
    }

    public ArchitectureNodes getTargetNodeId() {
        return targetNodeId;
    }

    public void setTargetNodeId(ArchitectureNodes targetNodeId) {
        this.targetNodeId = targetNodeId;
    }

    public ConnectionType getConnectionType() {
        return connectionType;
    }

    public void setConnectionType(ConnectionType connectionType) {
        this.connectionType = connectionType;
    }

    public Boolean getAnimated() {
        return isAnimated;
    }

    public void setAnimated(Boolean animated) {
        isAnimated = animated;
    }

    @Override
    public String toString() {
        return "NodeEdges{" +
                "id=" + id +
                ", sessionId=" + sessionId +
                ", sourceNodeId=" + sourceNodeId +
                ", targetNodeId=" + targetNodeId +
                ", connectionType=" + connectionType +
                ", isAnimated=" + isAnimated +
                '}';
    }
}
