package com.dibyajit.terragraphbackend.model.enums;

/**
 * Lifecycle states for an architecture generation session.
 */
public enum SessionStatus {
    DRAFT,
    GENERATING,
    COMPLETED,
    FAILED;

    /** Default status for newly created sessions. */
    public static final String DEFAULT = "DRAFT";
}
