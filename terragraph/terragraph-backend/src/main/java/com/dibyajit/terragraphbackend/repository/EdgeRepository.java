package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.NodeEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EdgeRepository extends JpaRepository<NodeEdge, String> {

    List<NodeEdge> findBySessionId(String sessionId);

    List<NodeEdge> findBySourceNodeId(String sourceNodeId);

    List<NodeEdge> findByTargetNodeId(String targetNodeId);

    void deleteBySessionId(String sessionId);
}
