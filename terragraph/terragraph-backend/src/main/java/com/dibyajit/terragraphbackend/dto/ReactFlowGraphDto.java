package com.dibyajit.terragraphbackend.dto;

import java.util.List;
import java.util.Map;

/**
 * The complete outbound DTO that the frontend consumes.
 * This is the exact JSON shape that React Flow + Monaco Editor expect.
 *
 * <p>Structure mirrors the React Flow data model 1:1 so the frontend
 * can hydrate its Zustand store directly from this payload.</p>
 *
 * @param sessionId     UUID of the persisted architecture session
 * @param nodes         list of cloud service nodes for the React Flow canvas
 * @param edges         list of connections between nodes
 * @param terraformCode the generated HCL/Terraform code for Monaco Editor
 */
public record ReactFlowGraphDto(
        String sessionId,
        List<NodeDto> nodes,
        List<EdgeDto> edges,
        String terraformCode
) {
    /**
     * A single node on the React Flow canvas.
     *
     * @param id       unique node identifier
     * @param type     the React Flow custom node type (e.g., "aws-ec2", "aws-rds")
     * @param position x/y coordinates on the canvas
     * @param data     label + metadata payload rendered inside the custom node
     */
    public record NodeDto(
            String id,
            String type,
            Position position,
            NodeData data
    ) {}

    /**
     * A directed edge connecting two nodes.
     *
     * @param id       unique edge identifier
     * @param source   source node ID
     * @param target   target node ID
     * @param label    connection description (e.g., "HTTPS", "VPC Peering")
     * @param animated whether React Flow should animate the edge line
     */
    public record EdgeDto(
            String id,
            String source,
            String target,
            String label,
            boolean animated
    ) {}

    /**
     * Canvas coordinates for node placement.
     *
     * @param x horizontal position
     * @param y vertical position
     */
    public record Position(int x, int y) {}

    /**
     * Data payload rendered inside a custom React Flow node.
     *
     * @param label    human-readable service name
     * @param metadata arbitrary config (e.g., instance_type, region, encrypted)
     */
    public record NodeData(
            String label,
            Map<String, Object> metadata
    ) {}
}
