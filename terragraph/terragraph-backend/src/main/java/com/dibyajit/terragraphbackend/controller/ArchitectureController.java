package com.dibyajit.terragraphbackend.controller;

import com.dibyajit.terragraphbackend.dto.GenerateRequest;
import com.dibyajit.terragraphbackend.dto.ReactFlowGraphDto;
import com.dibyajit.terragraphbackend.service.OrchestrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/architecture")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArchitectureController {

    private final OrchestrationService orchestrationService;

    @PostMapping("/generate")
    public ResponseEntity<ReactFlowGraphDto> generate(@Valid @RequestBody GenerateRequest request) {
        return ResponseEntity.ok(orchestrationService.generateArchitecture(
                request.prompt(), 
                request.userId()
        ));
    }

    @PostMapping("/sync")
    public ResponseEntity<ReactFlowGraphDto> sync(@RequestBody ReactFlowGraphDto request, @RequestParam(defaultValue = "default-user-id") String userId) {
        return ResponseEntity.ok(orchestrationService.syncArchitecture(request, userId));
    }

    @PostMapping("/save")
    public ResponseEntity<ReactFlowGraphDto> save(@RequestBody ReactFlowGraphDto request, @RequestParam String userId) {
        return ResponseEntity.ok(orchestrationService.saveArchitecture(request, userId));
    }

    @GetMapping("/sessions")
    public ResponseEntity<java.util.List<com.dibyajit.terragraphbackend.dto.SessionSummaryDto>> getUserSessions(@RequestParam String userId) {
        return ResponseEntity.ok(orchestrationService.getUserSessions(userId));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ReactFlowGraphDto> getSession(@PathVariable String sessionId, @RequestParam String userId) {
        return ResponseEntity.ok(orchestrationService.getSession(sessionId, userId));
    }
}
