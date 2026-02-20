import { useState } from 'react';
import api from '../api/client';
import { ACCENT, DIM, DIM3, SURFACE, MONO } from '../styles/theme';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ username: '', password: '', display_name: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      const r = mode === 'signup' ? await api.signup(f) : await api.login(f);
      localStorage.setItem('token', r.token); onLogin(r.user);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0B', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380, animation: 'fadeIn 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>◎</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Life Tracker</h1>
          <p style={{ fontSize: 14, color: DIM, marginTop: 8, fontWeight: 500 }}>Tasks · Habits · Fitness · Work · Finance · Goals</p>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 26, background: SURFACE, borderRadius: 12, padding: 3 }}>
          {['login','signup'].map(m => (<button key={m} onClick={() => { setMode(m); setErr(''); }} style={{ flex: 1, padding: '12px 0', borderRadius: 10, cursor: 'pointer', border: 'none', fontSize: 13, fontFamily: MONO, fontWeight: 700, background: mode===m?ACCENT:'transparent', color: mode===m?'#0A0A0B':DIM, transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: 1 }}>{m}</button>))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && <div><label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DIM, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 7 }}>Display Name</label><input value={f.display_name} onChange={e => setF({...f, display_name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: 12, background: SURFACE, border: `1px solid ${DIM3}`, color: '#fff', fontSize: 16, fontWeight: 500, outline: 'none' }} placeholder="How should we call you?"/></div>}
          <div><label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DIM, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 7 }}>Username</label><input value={f.username} onChange={e => setF({...f, username: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: 12, background: SURFACE, border: `1px solid ${DIM3}`, color: '#fff', fontSize: 16, fontWeight: 500, outline: 'none' }} placeholder="Choose a username" autoComplete="username"/></div>
          <div><label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DIM, fontFamily: MONO, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 7 }}>Password</label><input type="password" value={f.password} onChange={e => setF({...f, password: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: 12, background: SURFACE, border: `1px solid ${DIM3}`, color: '#fff', fontSize: 16, fontWeight: 500, outline: 'none' }} placeholder={mode==='signup'?'Min 6 characters':'Enter password'} autoComplete={mode==='signup'?'new-password':'current-password'} onKeyDown={e => e.key==='Enter' && submit()}/></div>
        </div>
        {err && <div style={{ marginTop: 14, padding: '11px 14px', borderRadius: 12, background: '#F8717118', border: '1px solid #F8717133', color: '#F87171', fontSize: 13.5, fontWeight: 600 }}>{err}</div>}
        <button onClick={submit} disabled={loading||!f.username||!f.password} style={{ width: '100%', padding: '16px 20px', borderRadius: 14, marginTop: 22, background: ACCENT, border: 'none', color: '#0A0A0B', fontSize: 15, fontWeight: 800, fontFamily: MONO, cursor: loading?'wait':'pointer', opacity: loading||!f.username||!f.password?0.4:1, transition: 'opacity 0.2s' }}>{loading?'Please wait...':mode==='signup'?'Create Account':'Log In'}</button>
        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: DIM, fontWeight: 500 }}>{mode==='login'?"Don't have an account? ":'Already have an account? '}<button onClick={() => { setMode(mode==='login'?'signup':'login'); setErr(''); }} style={{ background: 'none', border: 'none', color: ACCENT, cursor: 'pointer', fontSize: 14, fontWeight: 700, textDecoration: 'underline' }}>{mode==='login'?'Sign Up':'Log In'}</button></p>
      </div>
    </div>
  );
}
