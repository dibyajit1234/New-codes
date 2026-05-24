import React from 'react';
import Header from '@/components/ui/Header';
import PromptPanel from '@/components/ui/PromptPanel';
import ArchitectureCanvas from '@/components/canvas/ArchitectureCanvas';
import TerraformEditor from '@/components/editor/TerraformEditor';
import ComponentPalette from '@/components/ui/ComponentPalette';
import SessionList from '@/components/ui/SessionList';
import AuthPage from '@/components/ui/AuthPage';
import { useGraphStore } from '@/store/useGraphStore';
import { useAuthStore } from '@/store/useAuthStore';

// =============================================================================
// App — Root Layout
//
//  ┌─────────────────────────────── Header (52px) ────────────────────────────┐
//  │  Left Sidebar (320px)    │   Canvas (flex-1)    │  Terraform Panel (380px) │
//  │  ├─ PromptPanel          │                      │                          │
//  │  └─ Session Stats        │  React Flow Canvas   │  Monaco HCL Editor       │
//  └──────────────────────────┴──────────────────────┴──────────────────────────┘
// =============================================================================

const App: React.FC = () => {
  const { nodes, edges, status } = useGraphStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
        <aside style={{
          width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-bg-surface)',
        }}>
          <PromptPanel />

          {/* Stats Panel */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)' }}>Graph Stats</p>

            {[
              { label: 'Nodes', value: nodes.length, color: 'var(--color-accent-primary)' },
              { label: 'Edges', value: edges.length, color: 'var(--color-accent-secondary)' },
              { label: 'Status', value: status.toUpperCase(), color:
                  status === 'success' ? 'var(--color-accent-green)'
                  : status === 'error' ? 'var(--color-accent-red)'
                  : status === 'loading' ? 'var(--color-accent-amber)'
                  : 'var(--color-text-muted)'
              },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '8px 10px',
                background: 'var(--color-bg-elevated)', borderRadius: 8,
                border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)', color }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <ComponentPalette />
          
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 16px 0' }} />
          
          <SessionList />
        </aside>

        {/* ── React Flow Canvas ─────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <ArchitectureCanvas />
        </main>

        {/* ── Terraform Editor ──────────────────────────────────────────────── */}
        <div style={{ width: 420, flexShrink: 0 }}>
          <TerraformEditor />
        </div>
      </div>
    </div>
  );
};

export default App;
