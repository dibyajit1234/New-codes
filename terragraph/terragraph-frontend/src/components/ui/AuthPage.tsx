import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import '@/styles/globals.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const { login, register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, username });
      }
    } catch (err) {
      console.error('Auth error', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'var(--color-bg-base)',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)', zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'var(--color-bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-glow), 0 24px 48px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '8px'
          }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {isLogin ? 'Enter your details to access TerraGraph.' : 'Sign up to generate infrastructure.'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  background: 'rgba(10, 22, 40, 0.5)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'rgba(10, 22, 40, 0.5)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              background: 'var(--color-accent-primary)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = 'var(--color-accent-primary)')}
            onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: 'var(--color-accent-primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
