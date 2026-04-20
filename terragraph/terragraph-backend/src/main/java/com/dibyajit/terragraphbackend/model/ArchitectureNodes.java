package com.dibyajit.terragraphbackend.model;

import com.dibyajit.terragraphbackend.model.enums.Label;
import com.dibyajit.terragraphbackend.model.enums.NodeType;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;

import java.util.Map;
import java.util.UUID;
import io.hypersistence.utils.hibernate.type.json.JsonType;

@Entity
@Table(name="architecture_nodes")
public class ArchitectureNodes {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id",nullable = false,updatable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "session_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ArchitectureSession sessionId;

    @Column(name="node_type",nullable = false)
    private NodeType nodeType;

    @Column(name="label",nullable = false)
    private Label label;

    @Column(name="pos_x",nullable = false)
    private int posX;

    @Column(name="pos_y",nullable = false)
    private int posY;

    @Column(name="node_metadata",columnDefinition = "jsonb")
    @Type(JsonType.class)
    private Map<String,Object> nodeMetadata;

    public ArchitectureNodes() {
    }

    public ArchitectureNodes(UUID id, ArchitectureSession sessionId, NodeType nodeType, Label label, int posX, int posY, Map<String, Object> nodeMetadata) {
        this.id = id;
        this.sessionId = sessionId;
        this.nodeType = nodeType;
        this.label = label;
        this.posX = posX;
        this.posY = posY;
        this.nodeMetadata = nodeMetadata;
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

    public NodeType getNodeType() {
        return nodeType;
    }

    public void setNodeType(NodeType nodeType) {
        this.nodeType = nodeType;
    }

    public Label getLabel() {
        return label;
    }

    public void setLabel(Label label) {
        this.label = label;
    }

    public int getPosX() {
        return posX;
    }

    public void setPosX(int posX) {
        this.posX = posX;
    }

    public int getPosY() {
        return posY;
    }

    public void setPosY(int posY) {
        this.posY = posY;
    }

    public Map<String, Object> getNodeMetadata() {
        return nodeMetadata;
    }

    public void setNodeMetadata(Map<String, Object> nodeMetadata) {
        this.nodeMetadata = nodeMetadata;
    }

    @Override
    public String toString() {
        return "ArchitectureNodes{" +
                "id=" + id +
                ", sessionId=" + sessionId +
                ", nodeType=" + nodeType +
                ", label=" + label +
                ", posX=" + posX +
                ", posY=" + posY +
                ", nodeMetadata=" + nodeMetadata +
                '}';
    }
}


