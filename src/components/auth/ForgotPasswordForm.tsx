'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/password-reset';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-success-box">
        <div className="auth-success-icon">📧</div>
        <h2>Check your inbox!</h2>
        <p>If an account exists for that email, we've sent a password reset link. It expires in 1 hour.</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error"><span className="auth-error-icon">⚠</span> {error}</div>}
      <label className="auth-field">
        <span>Email Address</span>
        <input type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
      </label>
      <button type="submit" className="primary-button auth-submit" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Sending...' : 'Send Reset Link →'}
      </button>
    </form>
  );
}
