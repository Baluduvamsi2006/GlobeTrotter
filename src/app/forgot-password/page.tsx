import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Forgot Password | GlobeTrotter' };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-layout">
      <div className="auth-image-panel">
        <div className="auth-image-overlay">
          <div className="brand" style={{ color: 'white' }}>
            <div className="brand-mark" style={{ background: 'white', color: 'var(--color-primary)' }}>✈</div>
            GlobeTrotter
          </div>
          <h2>We'll get you back on track.</h2>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>Forgot Password?</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
          <ForgotPasswordForm />
          <p className="auth-switch">
            <Link href="/login">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
