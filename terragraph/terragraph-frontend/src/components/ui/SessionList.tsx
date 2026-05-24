import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useGraphStore } from '@/store/useGraphStore';
import { architectureApi } from '@/api/client';
import type { SessionSummaryDto } from '@/types';

const SessionList: React.FC = () => {
  const { user } = useAuthStore();
  const { loadSession, sessionId: currentSessionId } = useGraphStore();
  const [sessions, setSessions] = useState<SessionSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await architectureApi.getSessions(user.userId);
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user, currentSessionId]); // Re-fetch when current session changes (saved)

  if (!user) return null;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          My Projects
        </p>
        <button
          onClick={fetchSessions}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)', padding: 0
          }}
          title="Refresh"
        >
          <Clock size={12} />
        </button>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        overflowY: 'auto', paddingRight: 4
      }}>
        {isLoading && sessions.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Loading...</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No saved projects.</p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.sessionId}
              onClick={() => loadSession(s.sessionId, user.userId)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: currentSessionId === s.sessionId ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-elevated)',
                border: `1px solid ${currentSessionId === s.sessionId ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (currentSessionId !== s.sessionId) {
                  e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                }
              }}
              onMouseOut={(e) => {
                if (currentSessionId !== s.sessionId) {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px'
                }}>
                  {s.prompt || 'Untitled Graph'}
                </span>
                {s.status === 'COMPLETED' ? (
                  <CheckCircle2 size={14} color="var(--color-accent-green)" />
                ) : (
                  <XCircle size={14} color="var(--color-accent-red)" />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-muted)' }}>
                <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                <span>{s.nodeCount} nodes</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionList;
