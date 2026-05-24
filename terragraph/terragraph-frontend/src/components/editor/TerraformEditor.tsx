import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useGraphStore } from '@/store/useGraphStore';
import { Copy, Download, CheckCheck } from 'lucide-react';

const TerraformEditor: React.FC = () => {
  const terraformCode = useGraphStore((s) => s.terraformCode);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!terraformCode) return;
    await navigator.clipboard.writeText(terraformCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!terraformCode) return;
    const blob = new Blob([terraformCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, border: '1px solid var(--color-border)',
    borderRadius: 6, background: 'transparent',
    color: 'var(--color-text-secondary)', cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--color-bg-surface)', borderLeft: '1px solid var(--color-border)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-elevated)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Terraform</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-accent-green)',
            background: 'rgba(16,185,129,0.1)', padding: '2px 6px',
            borderRadius: 4, fontFamily: 'var(--font-mono)' }}>HCL</span>
        </div>
        {terraformCode && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button id="btn-copy-terraform" onClick={handleCopy} style={btnStyle} title="Copy">
              {copied ? <CheckCheck size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
            <button id="btn-download-terraform" onClick={handleDownload} style={btnStyle} title="Download main.tf">
              <Download size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {!terraformCode ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center' }}>
            <p style={{ color: 'rgba(148,163,184,0.35)', fontSize: 13 }}>
              Terraform code will appear here
            </p>
          </div>
        ) : (
          <MonacoEditor
            height="100%"
            language="hcl"
            value={terraformCode}
            theme="vs-dark"
            options={{
              readOnly: true, fontSize: 13,
              fontFamily: 'JetBrains Mono, monospace', fontLigatures: true,
              lineNumbers: 'on', minimap: { enabled: false },
              scrollBeyondLastLine: false, wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TerraformEditor;
