import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | GlobeTrotter',
};

export default function RegisterPage() {
  return (
    <div className="auth-layout">
      <div className="auth-image-panel">
        <div className="auth-image-overlay">
          <div className="brand" style={{ color: 'white' }}>
            <div className="brand-mark" style={{ background: 'white', color: 'var(--color-primary)' }}>✈</div>
            GlobeTrotter
          </div>
          <h2>Start planning your dream trip today.</h2>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join GlobeTrotter to build and share your itineraries.</p>
          <RegisterForm />
          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
