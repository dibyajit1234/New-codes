package com.dibyajit.terragraphbackend.dto;

import com.dibyajit.terragraphbackend.model.NodeEdges;

import javax.swing.text.Position;
import java.util.List;
import java.util.Map;

public record ReactFlowGraphDto(
        String sessionId,
        List<NodeDto> nodes,
        List<EdgeDto> edges,
        String terraformCode
) {
    public record NodeDto(
            String id,
            String type,
            Position position,
            NodeData data
    ){}
    public record EdgeDto(
            String id,
            String source,
            String target,
            String lable,
            boolean animated
    ){}
    public record position(int x,int y){}
    public record  NodeData(
            String lable,
            Map<String,Object> metadata
    ){}
}
