package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<KnowledgeDocument, UUID> {
}
