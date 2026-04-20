package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.NodeEdges;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EdgeRepository extends JpaRepository<NodeEdges, UUID> {
    List<NodeEdges> findBySessionId(String id);
    List<NodeEdges> findBySourceNodeId(String id);
    List<NodeEdges> findByTargetNodeId(String id);
}
