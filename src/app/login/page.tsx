import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | GlobeTrotter',
};

export default function LoginPage() {
  return (
    <div className="auth-layout">
      <div className="auth-image-panel">
        <div className="auth-image-overlay">
          <div className="brand" style={{ color: 'white' }}>
            <div className="brand-mark" style={{ background: 'white', color: 'var(--color-primary)' }}>✈</div>
            GlobeTrotter
          </div>
          <h2>Welcome back to your adventures.</h2>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>Sign In</h1>
          <p className="auth-subtitle">Log in to manage your trips and itinerary.</p>
          <LoginForm />
          <p className="auth-switch">
            Don't have an account? <Link href="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
