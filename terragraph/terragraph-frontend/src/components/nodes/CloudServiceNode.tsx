import { memo } from 'react';
import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import type { NodeData } from '@/types';
import '@/styles/nodes.css';

// =============================================================================
// Node type → icon + accent class mapping
// =============================================================================

interface NodeConfig {
  icon: string;
  accentClass: string;
  label: string;
}

const NODE_CONFIG: Record<string, NodeConfig> = {
  'aws-ec2':    { icon: '⚙️', accentClass: 'node-accent--ec2',     label: 'EC2' },
  'aws-rds':    { icon: '🗄️', accentClass: 'node-accent--rds',     label: 'RDS' },
  'aws-s3':     { icon: '🪣', accentClass: 'node-accent--s3',      label: 'S3' },
  'aws-lambda': { icon: 'λ',  accentClass: 'node-accent--lambda',  label: 'Lambda' },
  'aws-vpc':    { icon: '🔒', accentClass: 'node-accent--vpc',     label: 'VPC' },
  'aws-alb':    { icon: '⚖️', accentClass: 'node-accent--alb',     label: 'ALB' },
  'aws-sns':    { icon: '📣', accentClass: 'node-accent--sns',     label: 'SNS' },
  'aws-sqs':    { icon: '📬', accentClass: 'node-accent--sqs',     label: 'SQS' },
};

const getConfig = (type: string): NodeConfig =>
  NODE_CONFIG[type.toLowerCase()] ?? {
    icon: '☁️',
    accentClass: 'node-accent--default',
    label: type.replace('aws-', '').toUpperCase(),
  };

// =============================================================================
// CloudServiceNode — Custom React Flow Node Component
// =============================================================================

interface CloudNodeData extends NodeData {
  label: string;
  metadata: Record<string, unknown>;
}

const CloudServiceNode = memo(({ id, data, type, selected }: NodeProps & { data: CloudNodeData }) => {
  const config = getConfig(type ?? 'default');
  const metaEntries = Object.entries(data.metadata ?? {}).slice(0, 3);
  const { setNodes, setEdges } = useReactFlow();

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div className={`cloud-node ${selected ? 'selected' : ''}`}>
      {selected && (
        <button className="cloud-node__delete" onClick={onDelete} title="Delete node">
          ✕
        </button>
      )}

      {/* ── Source Handle (top) ────────────────────────────────────────────── */}
      <Handle type="target" position={Position.Top} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="cloud-node__header">
        <div className={`cloud-node__icon ${config.accentClass}`}>
          {config.icon}
        </div>
        <span className="cloud-node__type-badge">{config.label}</span>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="cloud-node__body">
        <p className="cloud-node__label">{data.label}</p>

        {metaEntries.length > 0 && (
          <div className="cloud-node__meta">
            {metaEntries.map(([key, val]) => (
              <div className="cloud-node__meta-item" key={key}>
                {key}: <span>{String(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Target Handle (bottom) ─────────────────────────────────────────── */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CloudServiceNode.displayName = 'CloudServiceNode';
export default CloudServiceNode;

// =============================================================================
// Node Types registry — pass this to ReactFlow's nodeTypes prop
// =============================================================================

export const nodeTypes = {
  'aws-ec2':    CloudServiceNode,
  'aws-rds':    CloudServiceNode,
  'aws-s3':     CloudServiceNode,
  'aws-lambda': CloudServiceNode,
  'aws-vpc':    CloudServiceNode,
  'aws-alb':    CloudServiceNode,
  'aws-sns':    CloudServiceNode,
  'aws-sqs':    CloudServiceNode,
  'default':    CloudServiceNode,
};
