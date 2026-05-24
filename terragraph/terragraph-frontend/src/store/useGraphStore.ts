import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { architectureApi } from '@/api/client';
import type { GraphState, TerraGraphNodeDto, TerraGraphEdgeDto, ReactFlowGraphDto } from '@/types';

// =============================================================================
// useGraphStore — Global Zustand State
// Manages the React Flow graph, Terraform code, and generation lifecycle
// =============================================================================

const initialState = {
  sessionId: null as string | null,
  nodes: [] as TerraGraphNodeDto[],
  edges: [] as TerraGraphEdgeDto[],
  terraformCode: '',
  status: 'idle' as GraphState['status'],
  errorMessage: null as string | null,
  prompt: '',
};

export const useGraphStore = create<GraphState>()(
  devtools(
    (set) => ({
      ...initialState,

      setPrompt: (prompt: string) => set({ prompt }, false, 'setPrompt'),
      setNodes: (nodes) => set({ nodes }, false, 'setNodes'),
      setEdges: (edges) => set({ edges }, false, 'setEdges'),

      /**
       * Orchestrates the full generation pipeline:
       * 1. Sets loading state
       * 2. Calls Spring Boot backend (RAG + LLM)
       * 3. Populates nodes, edges, and terraform code in a single atomic update
       */
      generate: async (prompt: string, userId: string) => {
        set({ status: 'loading', errorMessage: null, prompt }, false, 'generate/start');

        try {
          const graph = await architectureApi.generate({ prompt, userId });

          set(
            {
              sessionId: graph.sessionId,
              nodes: graph.nodes,
              edges: graph.edges,
              terraformCode: graph.terraformCode,
              status: 'success',
            },
            false,
            'generate/success'
          );
        } catch (err) {
          set(
            {
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'Generation failed',
            },
            false,
            'generate/error'
          );
        }
      },

      /**
       * Syncs a manually edited graph back to the backend to generate updated Terraform code.
       */
      sync: async (userId: string) => {
        const { sessionId, nodes, edges, terraformCode } = useGraphStore.getState();
        set({ status: 'loading', errorMessage: null }, false, 'sync/start');

        try {
          const graph: ReactFlowGraphDto = {
            sessionId: sessionId || 'new-session',
            nodes,
            edges,
            terraformCode,
          };
          const updatedGraph = await architectureApi.sync(graph, userId);

          set(
            {
              sessionId: updatedGraph.sessionId,
              terraformCode: updatedGraph.terraformCode,
              status: 'success',
            },
            false,
            'sync/success'
          );
        } catch (err) {
          set(
            {
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'Sync failed',
            },
            false,
            'sync/error'
          );
        }
      },

      /**
       * Saves the current graph locally to the DB without LLM processing.
       */
      save: async (userId: string) => {
        const { sessionId, nodes, edges, terraformCode } = useGraphStore.getState();
        set({ status: 'loading', errorMessage: null }, false, 'save/start');

        try {
          const graph: ReactFlowGraphDto = {
            sessionId: sessionId || 'new-session',
            nodes,
            edges,
            terraformCode,
          };
          const updatedGraph = await architectureApi.save(graph, userId);

          set(
            {
              sessionId: updatedGraph.sessionId,
              terraformCode: updatedGraph.terraformCode,
              status: 'success',
            },
            false,
            'save/success'
          );
        } catch (err) {
          set(
            {
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'Save failed',
            },
            false,
            'save/error'
          );
        }
      },

      /**
       * Loads an existing session from the database.
       */
      loadSession: async (sessionId: string, userId: string) => {
        set({ status: 'loading', errorMessage: null }, false, 'load/start');
        try {
          const graph = await architectureApi.getSession(sessionId, userId);
          set(
            {
              sessionId: graph.sessionId,
              nodes: graph.nodes,
              edges: graph.edges,
              terraformCode: graph.terraformCode,
              status: 'success',
            },
            false,
            'load/success'
          );
        } catch (err) {
          set(
            {
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'Failed to load session',
            },
            false,
            'load/error'
          );
        }
      },

      reset: () => set(initialState, false, 'reset'),
    }),
    { name: 'TerraGraphStore' }
  )
);
