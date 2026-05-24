package com.dibyajit.terragraphbackend.service;

import com.dibyajit.terragraphbackend.dto.ReactFlowGraphDto;
import com.dibyajit.terragraphbackend.model.ArchitectureNode;
import com.dibyajit.terragraphbackend.model.ArchitectureSession;
import com.dibyajit.terragraphbackend.model.NodeEdge;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArchitectureMapper {

    public ReactFlowGraphDto toDto(ArchitectureSession session) {
        List<ReactFlowGraphDto.NodeDto> nodeDtos = session.getNodes().stream()
                .map(this::toNodeDto)
                .collect(Collectors.toList());

        List<ReactFlowGraphDto.EdgeDto> edgeDtos = session.getEdges().stream()
                .map(this::toEdgeDto)
                .collect(Collectors.toList());

        return new ReactFlowGraphDto(
                session.getId(),
                nodeDtos,
                edgeDtos,
                session.getGeneratedTerraform()
        );
    }

    private ReactFlowGraphDto.NodeDto toNodeDto(ArchitectureNode node) {
        return new ReactFlowGraphDto.NodeDto(
                node.getId(),
                node.getNodeType(),
                new ReactFlowGraphDto.Position(node.getPosX(), node.getPosY()),
                new ReactFlowGraphDto.NodeData(node.getLabel(), node.getNodeMetadata())
        );
    }

    private ReactFlowGraphDto.EdgeDto toEdgeDto(NodeEdge edge) {
        return new ReactFlowGraphDto.EdgeDto(
                edge.getId(),
                edge.getSourceNode().getId(),
                edge.getTargetNode().getId(),
                edge.getConnectionType(),
                edge.getAnimated()
        );
    }
}
