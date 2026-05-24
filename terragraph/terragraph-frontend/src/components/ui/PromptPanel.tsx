import React, { useState, useRef } from 'react';
import { Send, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { useAuthStore } from '@/store/useAuthStore';

const PromptPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const { generate, reset, status, errorMessage } = useGraphStore();
  const { user } = useAuthStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading || !user) return;
    await generate(trimmed, user.userId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 12,
    padding: 16, borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-bg-elevated)', flexShrink: 0,
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%', minHeight: 90, maxHeight: 180,
    padding: '10px 12px', borderRadius: 8,
    border: `1px solid ${isLoading ? 'var(--color-border)' : 'var(--color-border-hover)'}`,
    background: 'var(--color-bg-base)', color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5,
    resize: 'vertical', outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const submitBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
    padding: '9px 18px', border: 'none', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer',
    background: isLoading
      ? 'rgba(59,130,246,0.3)'
      : 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
    color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)',
    transition: 'opacity 0.2s ease', flex: 1,
  };

  const resetBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, border: '1px solid var(--color-border)',
    borderRadius: 8, background: 'transparent', cursor: 'pointer',
    color: 'var(--color-text-muted)',
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)' }}>
          Describe your infrastructure
        </span>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>⌘ + Enter to run</span>
      </div>

      <textarea
        ref={textareaRef}
        id="prompt-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. A web app with an EC2 auto-scaling group behind an ALB, an RDS PostgreSQL database in a private subnet, and an S3 bucket for static assets..."
        disabled={isLoading}
        style={textareaStyle}
      />

      {errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 6, color: '#ef4444', fontSize: 12 }}>
          <AlertCircle size={13} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button id="btn-generate" type="submit" disabled={isLoading || !input.trim()} style={submitBtnStyle}>
          {isLoading ? <Loader2 size={14} className="tg-spin" /> : <Send size={14} />}
          {isLoading ? 'Generating…' : 'Generate'}
        </button>
        <button id="btn-reset" type="button" onClick={reset} style={resetBtnStyle} title="Reset">
          <RotateCcw size={14} />
        </button>
      </div>
    </form>
  );
};

export default PromptPanel;
