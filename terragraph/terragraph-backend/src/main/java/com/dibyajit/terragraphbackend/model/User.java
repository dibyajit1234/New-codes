package com.dibyajit.terragraphbackend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id",nullable = false,updatable = false)
    private UUID id;
    @Column(name = "userName",nullable = false)
    private String userName;
    @Column(name="email",nullable = false)
    private String email;
    @Column(name="created",nullable = false)
    private LocalDateTime created;

    public User() {
    }

    public User(UUID id, String userName, String email, LocalDateTime created) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.created = created;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", created=" + created +
                '}';
    }
}
