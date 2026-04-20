package com.dibyajit.terragraphbackend.model;

import com.dibyajit.terragraphbackend.model.enums.Status;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="architecture_session")
public class ArchitectureSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id",nullable = false,updatable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name="original_prompt",nullable = false)
    private String original_prompt;

    @Column(name="generated_terraform")
    private String generated_terraform;

    @Column(name="status",nullable = false)
    private Status status=Status.getDefault();

    @Column(name = "created_at",nullable = false)
    private LocalDateTime created_at;

    @Column(name="updated_at")
    private LocalDateTime updated_at;

    @OneToMany(mappedBy = "sessionId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArchitectureNodes> nodes;

    public ArchitectureSession() {
    }

    public ArchitectureSession(UUID id, User user, String original_prompt, String generated_terraform, Status status, LocalDateTime created_at, LocalDateTime updated_at, List<ArchitectureNodes> nodes) {
        this.id = id;
        this.user = user;
        this.original_prompt = original_prompt;
        this.generated_terraform = generated_terraform;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.nodes = nodes;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOriginal_prompt() {
        return original_prompt;
    }

    public void setOriginal_prompt(String original_prompt) {
        this.original_prompt = original_prompt;
    }

    public String getGenerated_terraform() {
        return generated_terraform;
    }

    public void setGenerated_terraform(String generated_terraform) {
        this.generated_terraform = generated_terraform;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public List<ArchitectureNodes> getNodes() {
        return nodes;
    }

    public void setNodes(List<ArchitectureNodes> nodes) {
        this.nodes = nodes;
    }

    @Override
    public String toString() {
        return "ArchitectureSession{" +
                "id=" + id +
                ", user=" + user +
                ", original_prompt='" + original_prompt + '\'' +
                ", generated_terraform='" + generated_terraform + '\'' +
                ", status=" + status +
                ", created_at=" + created_at +
                ", updated_at=" + updated_at +
                ", nodes=" + nodes +
                '}';
    }
}
