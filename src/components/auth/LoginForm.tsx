'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error">
          <span className="auth-error-icon">⚠</span> {error}
        </div>
      )}

      <label className="auth-field">
        <span>Email Address</span>
        <input type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
      </label>

      <label className="auth-field">
        <span>Password</span>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
      </label>

      <div className="auth-extras">
        <label className="remember-me">
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="forgot-link">Forgot password?</a>
      </div>

      <button type="submit" className="primary-button auth-submit" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
