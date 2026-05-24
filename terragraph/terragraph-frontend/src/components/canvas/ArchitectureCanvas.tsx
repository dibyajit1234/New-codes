import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RefreshCw } from 'lucide-react';

import { nodeTypes } from '@/components/nodes/CloudServiceNode';
import { useGraphStore } from '@/store/useGraphStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { TerraGraphNodeDto, TerraGraphEdgeDto } from '@/types';

// =============================================================================
// Converters: Backend DTOs → React Flow Node/Edge format
// Time complexity: O(N) for nodes, O(E) for edges
// =============================================================================

const toFlowNode = (dto: TerraGraphNodeDto): Node => ({
  id: dto.id,
  type: dto.type ?? 'default',
  position: dto.position,
  data: dto.data,
  selected: false,
});

const toFlowEdge = (dto: TerraGraphEdgeDto): Edge => ({
  id: dto.id,
  source: dto.source,
  target: dto.target,
  label: dto.label,
  animated: dto.animated,
  markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  style: { stroke: '#3b82f6', strokeWidth: 2 },
  labelStyle: {
    fill: '#94a3b8',
    fontSize: 10,
    fontFamily: 'JetBrains Mono, monospace',
  },
  labelBgStyle: {
    fill: 'rgba(10, 22, 40, 0.85)',
    rx: 4,
    ry: 4,
  },
});

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 160;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
    return newNode;
  });

  return { nodes: newNodes, edges };
};

// =============================================================================
// ArchitectureCanvas
// =============================================================================

const ArchitectureCanvas: React.FC = () => {
  const storeDtoNodes = useGraphStore((s) => s.nodes);
  const storeDtoEdges = useGraphStore((s) => s.edges);
  const status = useGraphStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  // Convert DTOs → React Flow format, then layout with Dagre
  const { initialNodes, initialEdges } = useMemo(() => {
    const flowNodes = storeDtoNodes.map(toFlowNode);
    const flowEdges = storeDtoEdges.map(toFlowEdge);
    
    // Only layout if we have nodes
    if (flowNodes.length === 0) return { initialNodes: flowNodes, initialEdges: flowEdges };
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowNodes,
      flowEdges
    );
    return { initialNodes: layoutedNodes, initialEdges: layoutedEdges };
  }, [storeDtoNodes, storeDtoEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync store updates (from backend generation) into React Flow's local state
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  const onInit = useCallback((instance: any) => {
    console.debug('[ReactFlow] Canvas initialised');
    setReactFlowInstance(instance);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const { type, label } = JSON.parse(rawData);

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { label, metadata: {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleSync = async () => {
    // Map local React Flow nodes/edges back to DTOs
    const updatedNodes: TerraGraphNodeDto[] = nodes.map((n) => ({
      id: n.id,
      type: n.type || 'default',
      position: n.position,
      data: n.data as any,
    }));
    const updatedEdges: TerraGraphEdgeDto[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: (e.label as string) || '',
      animated: e.animated || false,
    }));

    // Update Zustand store and trigger sync
    useGraphStore.getState().setNodes(updatedNodes);
    useGraphStore.getState().setEdges(updatedEdges);
    if (user) {
      await useGraphStore.getState().sync(user.userId);
    }
  };

  const handleSave = async () => {
    // Map local React Flow nodes/edges back to DTOs
    const updatedNodes: TerraGraphNodeDto[] = nodes.map((n) => ({
      id: n.id,
      type: n.type || 'default',
      position: n.position,
      data: n.data as any,
    }));
    const updatedEdges: TerraGraphEdgeDto[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: (e.label as string) || '',
      animated: e.animated || false,
    }));

    useGraphStore.getState().setNodes(updatedNodes);
    useGraphStore.getState().setEdges(updatedEdges);
    if (user) {
      await useGraphStore.getState().save(user.userId);
    }
  };

  const isEmpty = storeDtoNodes.length === 0 && nodes.length === 0;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(59,130,246,0.12)"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const type = node.type ?? 'default';
            const colours: Record<string, string> = {
              'aws-ec2': '#fb923c', 'aws-rds': '#63b3ed', 'aws-s3': '#34d399',
              'aws-lambda': '#a78bfa', 'aws-vpc': '#fbbf24', 'aws-alb': '#ef4444',
            };
            return colours[type] ?? '#94a3b8';
          }}
          maskColor="rgba(5, 11, 24, 0.7)"
          style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.15)' }}
        />
      </ReactFlow>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      {nodes.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          zIndex: 10,
        }}>
          <button
            onClick={handleSave}
            disabled={status === 'loading'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: 'var(--shadow-card)',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            Save Graph
          </button>
          
          <button
            onClick={handleSync}
            disabled={status === 'loading'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--color-accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            <RefreshCw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
            Sync to Terraform
          </button>
        </div>
      )}

      {/* ── Empty State Overlay ──────────────────────────────────────────────── */}
      {isEmpty && status !== 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', gap: '12px',
        }}>
          <div style={{ fontSize: '48px', opacity: 0.2 }}>☁️</div>
          <p style={{ color: 'rgba(148,163,184,0.4)', fontSize: '14px', fontWeight: 500 }}>
            Describe your infrastructure to generate a graph
          </p>
        </div>
      )}

      {/* ── Loading Overlay ──────────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,11,24,0.7)', backdropFilter: 'blur(4px)',
          gap: '16px',
        }}>
          <div className="tg-spinner" />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Generating architecture with AI…
          </p>
        </div>
      )}
    </div>
  );
};

export default ArchitectureCanvas;
