package com.dibyajit.terragraphbackend.model;

import com.dibyajit.terragraphbackend.model.enums.DocType;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "knowledge_document")
public class KnowledgeDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id",nullable = false,updatable = false)
    private UUID id;

    @Column(name = "title",nullable = false)
    private String title;

    @Column(name="doc_type",nullable = false)
    private DocType docType;

    @Column(name = "author")
    private String author;


    @Column(name="uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    public KnowledgeDocument() {
    }

    public KnowledgeDocument(UUID id, String title, DocType docType, String author, LocalDateTime uploadedAt) {
        this.id = id;
        this.title = title;
        this.docType = docType;
        this.author = author;
        this.uploadedAt = uploadedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DocType getDocType() {
        return docType;
    }

    public void setDocType(DocType docType) {
        this.docType = docType;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public String toString() {
        return "KnowledgeDocument{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", docType=" + docType +
                ", author='" + author + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
