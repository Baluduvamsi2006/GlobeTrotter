'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';
import { SECURITY_QUESTIONS } from '@/lib/constants';
import { signIn } from 'next-auth/react';

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

export default function RegisterForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const strength = getPasswordStrength(password);
  const passwordMatch = confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(value)}`);
    const data = await res.json();
    setUsernameStatus(data.available ? 'available' : 'taken');
  }, []);

  useEffect(() => {
    if (!username) { setUsernameStatus('idle'); return; }
    const t = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(t);
  }, [username, checkUsername]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passwordMismatch) { setError('Passwords do not match'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return; }
    if (usernameStatus === 'taken') { setError('Username is already taken'); return; }
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const submittedEmail = formData.get('email') as string;
    const pwd = formData.get('password') as string;
    const res = await signIn('credentials', { redirect: false, email: submittedEmail, password: pwd });
    if (res?.error) {
      router.push('/login');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  const usernameIcon =
    usernameStatus === 'checking' ? '⏳' :
    usernameStatus === 'available' ? '✅' :
    usernameStatus === 'taken' ? '❌' : '';

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error">
          <span className="auth-error-icon">⚠</span> {error}
        </div>
      )}

      {/* Profile Photo */}
      <div className="photo-upload-row">
        <div
          className="photo-circle"
          onClick={() => fileInputRef.current?.click()}
          title="Upload profile photo"
        >
          {photoPreview
            ? <img src={photoPreview} alt="Profile preview" className="photo-preview-img" />
            : <span className="photo-placeholder">📷<br /><small>Add Photo</small></span>
          }
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="profilePhoto"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPhotoPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      {/* Name Row */}
      <div className="auth-row">
        <label className="auth-field">
          <span>First Name <span className="req">*</span></span>
          <input type="text" name="firstName" required placeholder="Alex" />
        </label>
        <label className="auth-field">
          <span>Last Name <span className="req">*</span></span>
          <input type="text" name="lastName" required placeholder="Smith" />
        </label>
      </div>

      {/* Username */}
      <label className="auth-field">
        <span>Username <span className="auth-optional">(optional)</span></span>
        <div className="input-with-icon">
          <input
            type="text"
            name="username"
            placeholder="alex_smith"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            autoComplete="username"
          />
          {usernameIcon && <span className="input-status-icon">{usernameIcon}</span>}
        </div>
        {usernameStatus === 'available' && <span className="field-hint success">Username is available!</span>}
        {usernameStatus === 'taken' && <span className="field-hint error">Username is already taken</span>}
      </label>

      {/* Email & Phone */}
      <div className="auth-row">
        <label className="auth-field">
          <span>Email Address <span className="req">*</span></span>
          <input type="email" name="email" required placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && <small className="auth-field-error">Enter a valid email address.</small>}
        </label>
        <label className="auth-field">
          <span>Phone Number</span>
          <input type="tel" name="phoneNumber" placeholder="+1 555 0123" />
        </label>
      </div>

      {/* City & Country */}
      <div className="auth-row">
        <label className="auth-field">
          <span>City</span>
          <input type="text" name="city" placeholder="New York" />
        </label>
        <label className="auth-field">
          <span>Country</span>
          <input type="text" name="country" placeholder="United States" />
        </label>
      </div>

      {/* Additional Info */}
      <label className="auth-field">
        <span>Additional Information</span>
        <textarea
          name="additionalInfo"
          className="auth-textarea"
          placeholder="Tell us about yourself, your travel interests..."
          rows={3}
        />
      </label>

      {/* Password */}
      <label className="auth-field">
        <span>Password <span className="req">*</span></span>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Min. 8 chars, uppercase, number, symbol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        {password && (
          <div className="strength-meter">
            <div className="strength-bar-track">
              <div
                className="strength-bar-fill"
                style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
              />
            </div>
            <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
          </div>
        )}
      </label>

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
            style={{ borderColor: passwordMismatch ? 'var(--color-alert)' : passwordMatch ? 'var(--color-success)' : undefined }}
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
          {passwordMatch && <span className="input-status-icon" style={{ right: 12, position: 'absolute' }}>✅</span>}
          {passwordMismatch && <span className="input-status-icon" style={{ right: 12, position: 'absolute' }}>❌</span>}
        </div>
        {passwordMismatch && <span className="field-hint error">Passwords don't match</span>}
      </label>

      {/* Security Question */}
      <label className="auth-field">
        <span>Security Question <span className="auth-optional">(for password recovery)</span></span>
        <select name="securityQuestion" className="auth-select">
          <option value="">— Select a question —</option>
          {SECURITY_QUESTIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </label>

      <label className="auth-field">
        <span>Security Answer</span>
        <input type="text" name="securityAnswer" placeholder="Your answer (case-insensitive)" />
      </label>

      <button type="submit" className="primary-button auth-submit" disabled={loading || usernameStatus === 'taken'}>
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
