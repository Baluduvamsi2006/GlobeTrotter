import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reset Password | GlobeTrotter' };

export default function ResetPasswordPage() {
  return (
    <div className="auth-layout">
      <div className="auth-image-panel">
        <div className="auth-image-overlay">
          <div className="brand" style={{ color: 'white' }}>
            <div className="brand-mark" style={{ background: 'white', color: 'var(--color-primary)' }}>✈</div>
            GlobeTrotter
          </div>
          <h2>Set a new password and get back to exploring.</h2>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>New Password</h1>
          <p className="auth-subtitle">Choose a strong password for your account.</p>
          <Suspense fallback={<p className="auth-subtitle">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
