package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.ArchitectureNodes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NodeRepository extends JpaRepository<ArchitectureNodes, UUID> {
    List<ArchitectureNodes> findBySessionId(String id);
}
