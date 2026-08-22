'use client';

import { useState } from 'react';
import { getSecurityQuestion, resetPassword } from '@/app/actions/auth';
import Link from 'next/link';

type Step = 'email' | 'question' | 'reset' | 'success';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await getSecurityQuestion(email);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setQuestion(result.question!);
    setStep('question');
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    formData.set('email', email);
    const result = await resetPassword(formData);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setStep('success');
  }

  if (step === 'success') {
    return (
      <div className="auth-success-box">
        <div className="auth-success-icon">✅</div>
        <h2>Password Reset!</h2>
        <p>Your password has been updated successfully.</p>
        <Link href="/login" className="primary-button auth-submit" style={{ display: 'inline-flex', marginTop: '16px' }}>
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      {step === 'email' && (
        <form className="auth-form" onSubmit={handleEmailSubmit}>
          {error && <div className="auth-error"><span className="auth-error-icon">⚠</span> {error}</div>}
          <label className="auth-field">
            <span>Enter your email address</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Looking up...' : 'Continue →'}
          </button>
        </form>
      )}

      {step === 'question' && (
        <form className="auth-form" onSubmit={handleReset}>
          {error && <div className="auth-error"><span className="auth-error-icon">⚠</span> {error}</div>}
          <div className="security-question-display">
            <span className="sq-label">Your Security Question:</span>
            <p className="sq-text">{question}</p>
          </div>
          <label className="auth-field">
            <span>Your Answer</span>
            <input type="text" name="securityAnswer" required placeholder="Enter your answer" />
          </label>
          <label className="auth-field">
            <span>New Password</span>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                required
                placeholder="Min. 8 chars, uppercase, number, symbol"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </label>
          <label className="auth-field">
            <span>Confirm New Password</span>
            <input type={showPassword ? 'text' : 'password'} name="confirmPassword" required placeholder="••••••••" />
          </label>
          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}
