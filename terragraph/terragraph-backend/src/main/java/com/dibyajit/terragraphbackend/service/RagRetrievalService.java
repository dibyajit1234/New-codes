package com.dibyajit.terragraphbackend.service;

import com.dibyajit.terragraphbackend.model.DocumentChunk;
import com.dibyajit.terragraphbackend.repository.ChunkVectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagRetrievalService {

    private final ChunkVectorRepository chunkRepository;
    private final EmbeddingModel embeddingModel;

    @Value("${terragraph.rag.top-k:5}")
    private int topK;

    public String retrieveContext(String prompt) {
        try {
            log.info("Generating embedding for prompt: {}", prompt);
            float[] vector = embeddingModel.embed(prompt);
            String vectorString = formatVector(vector);

            List<DocumentChunk> chunks = chunkRepository.findTopKBySemanticSimilarity(vectorString, topK);

            if (!chunks.isEmpty()) {
                log.info("Retrieved {} relevant context chunks for RAG", chunks.size());
                return chunks.stream()
                        .map(DocumentChunk::getContent)
                        .collect(Collectors.joining("\n\n---\n\n"));
            }
            log.info("No matching RAG chunks found, using default context");
        } catch (Exception e) {
            log.warn("Embedding/RAG retrieval unavailable ({}). Falling back to default context.", e.getMessage());
        }

        return "No specific security policies found. Use standard cloud best practices.";
    }

    private String formatVector(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            sb.append(vector[i]);
            if (i < vector.length - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
