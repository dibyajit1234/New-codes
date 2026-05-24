import React from 'react';

const NODE_TYPES = [
  { type: 'aws-ec2', label: 'EC2 Instance', color: '#fb923c' },
  { type: 'aws-rds', label: 'RDS Database', color: '#63b3ed' },
  { type: 'aws-s3', label: 'S3 Bucket', color: '#34d399' },
  { type: 'aws-alb', label: 'Load Balancer', color: '#ef4444' },
  { type: 'aws-vpc', label: 'VPC', color: '#fbbf24' },
  { type: 'aws-lambda', label: 'Lambda Function', color: '#a78bfa' },
];

const ComponentPalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        Components Palette
      </p>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
        Drag and drop to add to canvas
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
            style={{
              padding: '8px',
              border: `1px solid ${node.color}50`,
              background: 'var(--color-bg-elevated)',
              borderRadius: '6px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-text-primary)'
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: node.color }} />
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
