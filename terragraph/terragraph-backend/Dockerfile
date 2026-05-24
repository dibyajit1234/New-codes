# =============================================================================
# TerraGraph Backend — Multi-Stage Docker Build
# Stage 1: Maven build with dependency caching
# Stage 2: Lean JRE runtime (eclipse-temurin:21-jre-alpine)
# =============================================================================

# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper + POM first → dependency layer is cached on rebuild
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:resolve -B -q

# Copy source code and package (tests skipped in container builds)
COPY src/ src/
RUN ./mvnw package -DskipTests -B -q

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Non-root user for security
RUN addgroup -S terragraph && adduser -S terragraph -G terragraph

# Copy the fat JAR from the build stage
COPY --from=builder /build/target/*.jar app.jar
RUN chown -R terragraph:terragraph /app

USER terragraph
EXPOSE 8080

# Container-aware JVM tuning
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
