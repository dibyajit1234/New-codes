package com.dibyajit.terragraphbackend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Inbound request DTO for architecture generation.
 *
 * @param prompt the user's natural-language infrastructure description
 * @param userId the UUID of the requesting user
 */
public record GenerateRequest(
        @NotBlank(message = "Prompt must not be blank")
        String prompt,

        @NotBlank(message = "User ID must not be blank")
        String userId
) {}
