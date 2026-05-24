package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.ArchitectureNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<ArchitectureNode, String> {

    List<ArchitectureNode> findBySessionId(String sessionId);

    void deleteBySessionId(String sessionId);
}
