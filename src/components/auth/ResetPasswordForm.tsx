'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyResetToken, confirmPasswordReset } from '@/app/actions/password-reset';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'var(--color-alert)' };
  if (score === 2) return { score, label: 'Fair', color: '#F97316' };
  if (score === 3) return { score, label: 'Good', color: '#0284C7' };
  return { score, label: 'Strong', color: 'var(--color-success)' };
}

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const passwordMatch = confirmPassword && newPassword === confirmPassword;
  const passwordMismatch = confirmPassword && newPassword !== confirmPassword;

  useEffect(() => {
    verifyResetToken(token).then((r) => {
      setValid(r.valid);
      if (!r.valid) setError(r.error || 'Invalid link');
      setVerifying(false);
    });
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passwordMismatch) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const result = await confirmPasswordReset(token, new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  }

  if (verifying) return <p className="auth-subtitle">Verifying your link…</p>;

  if (!valid) {
    return (
      <div className="auth-error" style={{ marginTop: 16 }}>
        <span className="auth-error-icon">⚠</span> {error}
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-success-box">
        <div className="auth-success-icon">✅</div>
        <h2>Password Updated!</h2>
        <p>Redirecting to sign in page…</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error">
          <span className="auth-error-icon">⚠</span> {error}
        </div>
      )}

      {/* New Password */}
      <label className="auth-field">
        <span>New Password <span className="req">*</span></span>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            required
            placeholder="Min. 8 chars, uppercase, number, symbol"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        {newPassword && (
          <div className="strength-meter">
            <div className="strength-bar-track">
              <div
                className="strength-bar-fill"
                style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
              />
            </div>
            <span className="strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}
      </label>

      {/* Confirm Password */}
      <label className="auth-field">
        <span>Confirm Password <span className="req">*</span></span>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              borderColor: passwordMismatch
                ? 'var(--color-alert)'
                : passwordMatch
                ? 'var(--color-success)'
                : undefined,
            }}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            style={{ right: passwordMatch || passwordMismatch ? 36 : 12 }}
            onClick={() => setShowConfirmPassword((v) => !v)}
          >
            {showConfirmPassword ? '🙈' : '👁'}
          </button>
          {passwordMatch && (
            <span className="input-status-icon" style={{ right: 12, position: 'absolute' }}>
              ✅
            </span>
          )}
          {passwordMismatch && (
            <span className="input-status-icon" style={{ right: 12, position: 'absolute' }}>
              ❌
            </span>
          )}
        </div>
        {passwordMismatch && <span className="field-hint error">Passwords don't match</span>}
      </label>

      <button type="submit" className="primary-button auth-submit" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Updating...' : 'Set New Password'}
      </button>
    </form>
  );
}
