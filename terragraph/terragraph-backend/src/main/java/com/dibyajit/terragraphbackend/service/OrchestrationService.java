package com.dibyajit.terragraphbackend.service;

import com.dibyajit.terragraphbackend.dto.ReactFlowGraphDto;
import com.dibyajit.terragraphbackend.model.ArchitectureNode;
import com.dibyajit.terragraphbackend.model.ArchitectureSession;
import com.dibyajit.terragraphbackend.model.NodeEdge;
import com.dibyajit.terragraphbackend.model.User;
import com.dibyajit.terragraphbackend.model.enums.SessionStatus;
import com.dibyajit.terragraphbackend.repository.SessionRepository;
import com.dibyajit.terragraphbackend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrchestrationService {

    private final ChatClient chatClient;
    private final RagRetrievalService ragService;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ArchitectureMapper mapper;
    private final ObjectMapper objectMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public ReactFlowGraphDto generateArchitecture(String prompt, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String context = ragService.retrieveContext(prompt);

        String systemInstructions = """
                You are a Cloud Architect. Generate a valid React Flow graph AND Terraform code.
                Follow these rules:
                1. Use the provided context for security compliance.
                2. Return ONLY a JSON object matching the ReactFlowGraphDto structure.
                3. Ensure nodes have valid x/y coordinates.
                4. Node types must be standard (aws-ec2, aws-rds, etc.).
                
                CONTEXT:
                {context}
                """;

        log.info("Querying LLM for prompt: {}", prompt);
        
        ReactFlowGraphDto result = chatClient.prompt()
                .system(s -> s.text(systemInstructions).param("context", context))
                .user(prompt)
                .advisors(new org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor())
                .call()
                .entity(ReactFlowGraphDto.class);

        ArchitectureSession session = ArchitectureSession.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .originalPrompt(prompt)
                .generatedTerraform(result.terraformCode())
                .status(SessionStatus.COMPLETED.name())
                .build();

        java.util.List<ArchitectureNode> newNodes = result.nodes().stream().map(n -> ArchitectureNode.builder()
                .id(n.id() != null ? session.getId() + "_" + n.id() : UUID.randomUUID().toString())
                .session(session)
                .nodeType(n.type())
                .label(n.data().label())
                .posX(n.position().x())
                .posY(n.position().y())
                .nodeMetadata(n.data().metadata())
                .build()).toList();
        session.setNodes(newNodes);

        java.util.List<NodeEdge> newEdges = result.edges().stream().map(e -> NodeEdge.builder()
                .id(e.id() != null ? session.getId() + "_" + e.id() : UUID.randomUUID().toString())
                .session(session)
                .sourceNode(findNode(session, session.getId() + "_" + e.source()))
                .targetNode(findNode(session, session.getId() + "_" + e.target()))
                .connectionType(e.label())
                .animated(e.animated())
                .build()).toList();
        session.setEdges(newEdges);

        entityManager.persist(session);
        return mapper.toDto(session);
    }

    private ArchitectureNode findNode(ArchitectureSession session, String id) {
        return session.getNodes().stream()
                .filter(n -> n.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Edge refers to non-existent node: " + id));
    }

    @Transactional
    public ReactFlowGraphDto syncArchitecture(ReactFlowGraphDto graph, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String graphJson;
        try {
            graphJson = objectMapper.writeValueAsString(graph);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize graph", e);
        }

        String systemInstructions = """
                You are a Cloud Architect. Generate valid Terraform code for the provided Architecture Graph JSON.
                The JSON contains an array of AWS nodes and edges connecting them.
                Follow these rules:
                1. Only return the updated ReactFlowGraphDto containing your generated terraformCode.
                2. DO NOT change the existing nodes and edges structure. Include them exactly as provided.
                3. Return ONLY a JSON object matching ReactFlowGraphDto.
                """;

        log.info("Querying LLM to sync terraform for manual graph...");

        ReactFlowGraphDto result = chatClient.prompt()
                .system(systemInstructions)
                .user(u -> u.text("{graphJson}").param("graphJson", graphJson))
                .advisors(new org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor())
                .call()
                .entity(ReactFlowGraphDto.class);

        ArchitectureSession session = ArchitectureSession.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .originalPrompt("Manual UI Graph Edit")
                .generatedTerraform(result.terraformCode())
                .status(SessionStatus.COMPLETED.name())
                .build();

        java.util.List<ArchitectureNode> newNodes = graph.nodes().stream().map(n -> ArchitectureNode.builder()
                .id(n.id() != null ? session.getId() + "_" + n.id() : UUID.randomUUID().toString())
                .session(session)
                .nodeType(n.type())
                .label(n.data().label())
                .posX(n.position().x())
                .posY(n.position().y())
                .nodeMetadata(n.data().metadata())
                .build()).toList();
        session.setNodes(newNodes);

        java.util.List<NodeEdge> newEdges = graph.edges().stream().map(e -> NodeEdge.builder()
                .id(e.id() != null ? session.getId() + "_" + e.id() : UUID.randomUUID().toString())
                .session(session)
                .sourceNode(findNode(session, session.getId() + "_" + e.source()))
                .targetNode(findNode(session, session.getId() + "_" + e.target()))
                .connectionType(e.label())
                .animated(e.animated())
                .build()).toList();
        session.setEdges(newEdges);

        entityManager.persist(session);
        return mapper.toDto(session);
    }

    @Transactional
    public ReactFlowGraphDto saveArchitecture(ReactFlowGraphDto graph, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ArchitectureSession session = sessionRepository.findById(graph.sessionId())
                .orElseGet(() -> {
                    ArchitectureSession newSession = ArchitectureSession.builder()
                            .id(UUID.randomUUID().toString())
                            .user(user)
                            .originalPrompt("Saved Layout")
                            .status(SessionStatus.COMPLETED.name())
                            .build();
                    entityManager.persist(newSession);
                    return newSession;
                });

        if (!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        session.getNodes().clear();
        session.getEdges().clear();
        entityManager.flush(); // ensure orphans are removed before adding new ones with potentially same IDs

        session.setGeneratedTerraform(graph.terraformCode());

        java.util.List<ArchitectureNode> newNodes = graph.nodes().stream().map(n -> ArchitectureNode.builder()
                .id(UUID.randomUUID().toString()) // Always generate fresh IDs for persistence
                .session(session)
                .nodeType(n.type())
                .label(n.data().label())
                .posX(n.position().x())
                .posY(n.position().y())
                .nodeMetadata(n.data().metadata())
                .build()).toList();
        
        // Build a map of old ID to new UUID to reconnect edges properly
        java.util.Map<String, ArchitectureNode> nodeMap = new java.util.HashMap<>();
        for (int i = 0; i < graph.nodes().size(); i++) {
            nodeMap.put(graph.nodes().get(i).id(), newNodes.get(i));
        }

        session.getNodes().addAll(newNodes);
        sessionRepository.saveAndFlush(session); // Flush to assign managed state to nodes

        java.util.List<NodeEdge> newEdges = graph.edges().stream()
                .filter(e -> nodeMap.containsKey(e.source()) && nodeMap.containsKey(e.target()))
                .map(e -> NodeEdge.builder()
                .id(UUID.randomUUID().toString())
                .session(session)
                .sourceNode(nodeMap.get(e.source()))
                .targetNode(nodeMap.get(e.target()))
                .connectionType(e.label())
                .animated(e.animated())
                .build()).toList();
        session.getEdges().addAll(newEdges);

        return mapper.toDto(sessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public java.util.List<com.dibyajit.terragraphbackend.dto.SessionSummaryDto> getUserSessions(String userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(session -> com.dibyajit.terragraphbackend.dto.SessionSummaryDto.builder()
                        .sessionId(session.getId())
                        .prompt(session.getOriginalPrompt())
                        .status(session.getStatus())
                        .createdAt(session.getCreatedAt())
                        .nodeCount(session.getNodes().size())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReactFlowGraphDto getSession(String sessionId, String userId) {
        ArchitectureSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return mapper.toDto(session);
    }
}
