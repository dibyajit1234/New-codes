package com.dibyajit.terragraphbackend.repository;

import com.dibyajit.terragraphbackend.model.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for document chunks with native MySQL 9.0 VECTOR operations.
 *
 * <p>MySQL 9.0 provides {@code VECTOR_DISTANCE()} for computing cosine/euclidean
 * distance between VECTOR columns. This repository uses native queries to
 * perform semantic similarity search against the document_chunks table.</p>
 */
@Repository
public interface ChunkVectorRepository extends JpaRepository<DocumentChunk, String> {

    /**
     * Finds the top-K most semantically similar chunks to the given embedding.
     *
     * <p>Uses MySQL 9.0's native {@code VECTOR_DISTANCE()} function with
     * cosine distance. The query embedding must be passed as a
     * STRING_TO_VECTOR-compatible string: "[0.1, 0.2, ...]".</p>
     *
     * <p><b>Time Complexity:</b> O(N) full scan over document_chunks.
     * For production scale (>100K chunks), add a VECTOR INDEX.</p>
     *
     * @param queryEmbedding the embedding vector as a bracketed float string
     * @param topK           number of closest matches to return
     * @return ordered list of chunks, closest match first
     */
    @Query(value = """
            SELECT dc.*
            FROM document_chunks dc
            ORDER BY VECTOR_DISTANCE(dc.embedding, STRING_TO_VECTOR(:queryEmbedding), 'COSINE') ASC
            LIMIT :topK
            """, nativeQuery = true)
    List<DocumentChunk> findTopKBySemanticSimilarity(
            @Param("queryEmbedding") String queryEmbedding,
            @Param("topK") int topK
    );

    /**
     * Finds similar chunks with a distance threshold filter.
     * Only returns chunks closer than the given threshold (lower = more similar).
     *
     * @param queryEmbedding the embedding vector as a bracketed float string
     * @param threshold      maximum cosine distance (0.0 = identical, 1.0 = orthogonal)
     * @param topK           number of closest matches to return
     * @return ordered list of chunks within the similarity threshold
     */
    @Query(value = """
            SELECT dc.*
            FROM document_chunks dc
            WHERE VECTOR_DISTANCE(dc.embedding, STRING_TO_VECTOR(:queryEmbedding), 'COSINE') < :threshold
            ORDER BY VECTOR_DISTANCE(dc.embedding, STRING_TO_VECTOR(:queryEmbedding), 'COSINE') ASC
            LIMIT :topK
            """, nativeQuery = true)
    List<DocumentChunk> findBySemanticSimilarityWithThreshold(
            @Param("queryEmbedding") String queryEmbedding,
            @Param("threshold") double threshold,
            @Param("topK") int topK
    );

    /**
     * Inserts a chunk with its vector embedding using MySQL 9.0's STRING_TO_VECTOR().
     * Use this instead of JPA save() to properly handle the VECTOR column type.
     *
     * @param id            UUID string
     * @param documentId    parent document UUID
     * @param chunkIndex    ordering index
     * @param content       readable text
     * @param embedding     vector as bracketed float string: "[0.1, 0.2, ...]"
     */
    @Query(value = """
            INSERT INTO document_chunks (id, document_id, chunk_index, content, embedding)
            VALUES (:id, :documentId, :chunkIndex, :content, STRING_TO_VECTOR(:embedding))
            """, nativeQuery = true)
    void insertChunkWithVector(
            @Param("id") String id,
            @Param("documentId") String documentId,
            @Param("chunkIndex") int chunkIndex,
            @Param("content") String content,
            @Param("embedding") String embedding
    );

    List<DocumentChunk> findByDocumentIdOrderByChunkIndexAsc(String documentId);
}
