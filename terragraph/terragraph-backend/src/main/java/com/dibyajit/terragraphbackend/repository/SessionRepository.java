package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.ArchitectureSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<ArchitectureSession, String> {

    List<ArchitectureSession> findByUserIdOrderByCreatedAtDesc(String userId);

    List<ArchitectureSession> findByStatus(String status);
}
