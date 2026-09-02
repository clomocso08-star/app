import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn, LockKeyhole, Mail } from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { getConsolePath, loginUser } from '../services';

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useApp();

  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('student@phinmaed.edu.ph');
  const [password, setPassword] = useState('studentnigga');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await loginUser(email, password, role);
      if (!result.success || !result.user) {
        toast(result.message, 'danger');
        return;
      }

      signIn(result.user);
      toast(`Welcome back, ${result.user.name}.`, 'success');
      navigate(getConsolePath(result.user.role), { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="auth-panel" aria-labelledby="login-title">
        <header className="auth-panel__header">
          <div className="auth-icon">
            <LogIn className="react-icon" aria-hidden="true" />
          </div>
          <h1 id="login-title" className="auth-panel__title">Welcome back</h1>
          <p className="auth-panel__description">Sign in to reserve merchandise and track pickup.</p>
        </header>

        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="field">
            <label className="field-label" htmlFor="login-role">Account role</label>
            <select
              id="login-role"
              className="field-control"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="School Staff">School Staff</option>
              <option value="Admin">Admin / Developer</option>
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="login-email">Institutional email</label>
            <div className="field-control--icon">
              <Mail className="react-icon" aria-hidden="true" />
              <input
                type="email"
                id="login-email"
                className="field-control"
                required
                autoComplete="email"
                placeholder="student@phinmaed.edu.ph"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="field-control--icon">
              <LockKeyhole className="react-icon" aria-hidden="true" />
              <input
                type="password"
                id="login-password"
                className="field-control"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Signing in…' : 'Sign in'}</span>
            <ArrowRight className="react-icon" aria-hidden="true" />
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </footer>
      </section>
    </main>
  );
}
