// =============================================================================
// TerraGraph — Shared TypeScript Types
// Single source of truth for data contracts matching backend DTOs
// =============================================================================

export interface Position {
  x: number;
  y: number;
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  metadata: Record<string, unknown>;
}

export interface TerraGraphNodeDto {
  id: string;
  type: string;
  position: Position;
  data: NodeData;
}

export interface TerraGraphEdgeDto {
  id: string;
  source: string;
  target: string;
  label: string;
  animated: boolean;
}

export interface ReactFlowGraphDto {
  sessionId: string;
  nodes: TerraGraphNodeDto[];
  edges: TerraGraphEdgeDto[];
  terraformCode: string;
}

export interface GenerateRequest {
  prompt: string;
  userId: string;
}

export interface SessionSummaryDto {
  sessionId: string;
  prompt: string;
  status: string;
  createdAt: string;
  nodeCount: number;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  userId: string;
  username: string;
  email: string;
}

export interface AuthRequest {
  email: string;
  password?: string;
  username?: string;
}

// ── Generation Status ────────────────────────────────────────────────────────
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

// ── Graph Store State ────────────────────────────────────────────────────────
export interface GraphState {
  sessionId: string | null;
  nodes: TerraGraphNodeDto[];
  edges: TerraGraphEdgeDto[];
  terraformCode: string;
  status: GenerationStatus;
  errorMessage: string | null;
  prompt: string;

  // Actions
  setPrompt: (prompt: string) => void;
  setNodes: (nodes: TerraGraphNodeDto[]) => void;
  setEdges: (edges: TerraGraphEdgeDto[]) => void;
  generate: (prompt: string, userId: string) => Promise<void>;
  sync: (userId: string) => Promise<void>;
  save: (userId: string) => Promise<void>;
  loadSession: (sessionId: string, userId: string) => Promise<void>;
  reset: () => void;
}
