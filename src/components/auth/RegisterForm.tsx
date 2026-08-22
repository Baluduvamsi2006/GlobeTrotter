'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await registerUser(formData);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Auto login after successful registration
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        router.push('/login');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}
      <div className="auth-row">
        <label className="auth-field">
          <span>First Name</span>
          <input type="text" name="firstName" required placeholder="Alex" />
        </label>
        <label className="auth-field">
          <span>Last Name</span>
          <input type="text" name="lastName" required placeholder="Smith" />
        </label>
      </div>
      <label className="auth-field">
        <span>Email Address</span>
        <input type="email" name="email" required placeholder="you@example.com" />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input type="password" name="password" required placeholder="••••••••" minLength={6} />
      </label>
      <button type="submit" className="primary-button auth-submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
