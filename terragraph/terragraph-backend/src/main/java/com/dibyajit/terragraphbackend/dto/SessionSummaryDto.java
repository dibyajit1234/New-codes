package com.dibyajit.terragraphbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionSummaryDto {
    private String sessionId;
    private String prompt;
    private String status;
    private LocalDateTime createdAt;
    private int nodeCount;
}
