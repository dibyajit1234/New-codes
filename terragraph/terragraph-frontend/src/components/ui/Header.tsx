import React from 'react';
import { Layers, LogOut, User } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { useAuthStore } from '@/store/useAuthStore';

const Header: React.FC = () => {
  const status = useGraphStore((s) => s.status);
  const sessionId = useGraphStore((s) => s.sessionId);
  const { user, logout } = useAuthStore();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 52, flexShrink: 0,
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-bg-elevated)',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          boxShadow: '0 0 12px rgba(59,130,246,0.4)',
        }}>
          <Layers size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>
          Terra<span style={{ color: 'var(--color-accent-primary)' }}>Graph</span>
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-accent-secondary)',
          background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: 4,
          fontFamily: 'var(--font-mono)',
        }}>AI</span>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {sessionId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%',
              background: status === 'loading' ? '#f59e0b' : '#10b981',
              boxShadow: `0 0 6px ${status === 'loading' ? '#f59e0b' : '#10b981'}`,
            }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)' }}>
              {sessionId.slice(0, 8)}…
            </span>
          </div>
        )}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, borderLeft: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} color="var(--color-text-secondary)" />
              <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {user.username}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-muted)', fontSize: 12,
                transition: 'color 0.2s', padding: 0
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-red)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
