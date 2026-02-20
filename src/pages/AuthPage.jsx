import { useState } from 'react';
import api from '../api/client';
import { ACCENT, DIM, DIM2, DIM3, SURFACE, FONT_DISPLAY, FONT_MONO } from '../styles/theme';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', password: '', display_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await api.signup(form);
      } else {
        result = await api.login(form);
      }
      localStorage.setItem('token', result.token);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0B', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380, animation: 'fadeIn 0.3s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>◎</div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
            Life Tracker
          </h1>
          <p style={{ fontSize: 13, color: DIM, marginTop: 6 }}>
            Tasks · Habits · Fitness · Finance · Goals
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: SURFACE, borderRadius: 10, padding: 3 }}>
          {['login', 'signup'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              border: 'none', fontSize: 13, fontFamily: FONT_MONO, fontWeight: 600,
              background: mode === m ? ACCENT : 'transparent',
              color: mode === m ? '#0A0A0B' : DIM,
              transition: 'all 0.2s',
              textTransform: 'uppercase', letterSpacing: 1,
            }}>{m}</button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Display Name</label>
              <input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                style={inputStyle}
                placeholder="How should we call you?"
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={inputStyle}
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={inputStyle}
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 10,
            background: '#F8717118', border: '1px solid #F8717133',
            color: '#F87171', fontSize: 13,
          }}>{error}</div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading || !form.username || !form.password} style={{
          width: '100%', padding: '14px 20px', borderRadius: 12, marginTop: 20,
          background: ACCENT, border: 'none', color: '#0A0A0B',
          fontSize: 14, fontWeight: 700, fontFamily: FONT_MONO,
          cursor: loading ? 'wait' : 'pointer', letterSpacing: 0.5,
          opacity: loading || !form.username || !form.password ? 0.4 : 1,
          transition: 'opacity 0.2s',
        }}>
          {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}
        </button>

        {/* Switch mode hint */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: DIM }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{
            background: 'none', border: 'none', color: ACCENT, cursor: 'pointer',
            fontSize: 13, fontWeight: 600, textDecoration: 'underline',
          }}>
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 10, fontWeight: 500, color: DIM,
  fontFamily: FONT_MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
};
const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 10,
  background: SURFACE, border: `1px solid ${DIM3}`,
  color: '#fff', fontSize: 14, outline: 'none', fontFamily: FONT_DISPLAY,
};
