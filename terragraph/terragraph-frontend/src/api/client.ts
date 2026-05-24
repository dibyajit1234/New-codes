import axios from 'axios';
import type { GenerateRequest, ReactFlowGraphDto, AuthRequest, AuthResponse } from '@/types';

// =============================================================================
// Axios API Client
// Base URL resolves to /api in both Docker (Nginx proxy) and local dev (Vite proxy)
// =============================================================================

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120_000, // 2 min — LLM generation can be slow
});

// ── Request Interceptor (logging) ─────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// ── Response Interceptor (normalised error handling) ──────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data ??
      error.message ??
      'Unknown API error';
    return Promise.reject(new Error(String(message)));
  }
);

// =============================================================================
// API Functions
// =============================================================================

export const architectureApi = {
  /**
   * Sends a natural-language prompt to the Spring Boot backend.
   * The backend runs RAG + LLM and returns a fully hydrated graph DTO.
   */
  generate: (request: GenerateRequest): Promise<ReactFlowGraphDto> =>
    apiClient
      .post<ReactFlowGraphDto>('/architecture/generate', request)
      .then((res) => res.data),

  /**
   * Syncs a manually edited graph to the backend to generate updated Terraform code.
   */
  sync: (graph: ReactFlowGraphDto, userId: string = 'default-user-id'): Promise<ReactFlowGraphDto> =>
    apiClient
      .post<ReactFlowGraphDto>(`/architecture/sync?userId=${userId}`, graph)
      .then((res) => res.data),

  save: (graph: ReactFlowGraphDto, userId: string): Promise<ReactFlowGraphDto> =>
    apiClient
      .post<ReactFlowGraphDto>(`/architecture/save?userId=${userId}`, graph)
      .then((res) => res.data),

  getSessions: (userId: string): Promise<import('@/types').SessionSummaryDto[]> =>
    apiClient.get<import('@/types').SessionSummaryDto[]>(`/architecture/sessions?userId=${userId}`)
      .then((res) => res.data),

  getSession: (sessionId: string, userId: string): Promise<ReactFlowGraphDto> =>
    apiClient.get<ReactFlowGraphDto>(`/architecture/sessions/${sessionId}?userId=${userId}`)
      .then((res) => res.data),
};

export const authApi = {
  login: (data: AuthRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: AuthRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>('/auth/register', data).then((res) => res.data),
};

export default apiClient;
