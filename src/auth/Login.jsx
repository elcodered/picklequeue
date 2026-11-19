import React, { useState } from 'react';
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    setMessage('This is a design preview. Connect your authentication API to enable sign in.');
  }

  return (
    <main className="pq-auth-page">
      <div className="pq-auth-landscape" aria-hidden="true" />
      <div className="pq-auth-sunlight" aria-hidden="true" />
      <div className="pq-auth-ball" aria-hidden="true">
        <span className="pq-auth-ball-trail" />
        <span className="pq-auth-ball-body"><i/><i/><i/><i/><i/><i/></span>
      </div>

      <a className="pq-auth-brand" href="/" aria-label="Picklequeue home">
        <span className="pq-auth-brand-icon">p<span /></span>
        <span>picklequeue<span className="pq-auth-brand-dot">.</span></span>
      </a>

      <div className="pq-auth-content">
        <section className="pq-auth-intro" aria-label="Welcome to Picklequeue">
          <div className="pq-auth-eyebrow"><span /> MADE FOR OPEN PLAY</div>
          <h1>More playing.<br/><em>Less waiting.</em></h1>
          <p>Keep your pickleball games moving.</p>
        </section>

        <div className="pq-auth-card-frame">
          <div className="pq-auth-card-back" aria-hidden="true" />
          <div className="pq-auth-star" aria-hidden="true">✳</div>
          <section className="pq-auth-card" aria-labelledby="pq-auth-title">
            <header className="pq-auth-card-header">
              <h2 id="pq-auth-title">Sign in</h2>
              <p>Good to see you again.</p>
            </header>
            <form onSubmit={submit}>
              <div className="pq-auth-field">
                <label htmlFor="pq-auth-email">Email address</label>
                <div className="pq-auth-control">
                  <Mail size={20} aria-hidden="true" />
                  <input id="pq-auth-email" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="pq-auth-field">
                <label htmlFor="pq-auth-password">Password</label>
                <div className="pq-auth-control">
                  <LockKeyhole size={20} aria-hidden="true" />
                  <input id="pq-auth-password" type={visible ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button className="pq-auth-visibility" type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}>
                    {visible ? <EyeOff size={21} /> : <Eye size={21} />}
                  </button>
                </div>
              </div>
              <div className="pq-auth-options">
                <label className="pq-auth-remember"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me</label>
                <a href="#forgot-password" onClick={e => { e.preventDefault(); setMessage('Password recovery will be available when authentication is connected.'); }}>Forgot password?</a>
              </div>
              <button className="pq-auth-submit" type="submit">Sign in <ArrowRight size={21} aria-hidden="true" /></button>
              {message && <p className="pq-auth-message" role="status">{message}</p>}
            </form>
            <div className="pq-auth-divider"><span>or</span></div>
            <p className="pq-auth-signup">New to Picklequeue? <a href="#register" onClick={e => { e.preventDefault(); setMessage('Account registration will be available when authentication is connected.'); }}>Create an account</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
