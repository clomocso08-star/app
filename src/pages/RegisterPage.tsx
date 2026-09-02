import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserRoundPlus } from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { registerUser } from '../services';
import type { UserRole } from '../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [idNumber, setIdNumber] = useState('');
  const [organization, setOrganization] = useState('SJCM General');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await registerUser({
        name,
        email,
        role,
        idNumber,
        organization,
        password,
      });
      if (!result.success || !result.user) {
        toast(result.message, 'danger');
        return;
      }

      signIn(result.user);
      toast('Registration successful. Redirecting to your dashboard.', 'success');
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-shell">
      <section className="auth-panel" aria-labelledby="register-title">
        <header className="auth-panel__header">
          <div className="auth-icon">
            <UserRoundPlus className="react-icon" aria-hidden="true" />
          </div>
          <h1 id="register-title" className="auth-panel__title">Create an account</h1>
          <p className="auth-panel__description">
            Register once to reserve SJCM uniforms and organization merchandise.
          </p>
        </header>

        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="field">
            <label className="field-label" htmlFor="reg-name">Full name</label>
            <input
              type="text"
              id="reg-name"
              className="field-control"
              required
              autoComplete="name"
              placeholder="e.g. Juan dela Cruz"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-email">SJCM email address</label>
            <input
              type="email"
              id="reg-email"
              className="field-control"
              required
              autoComplete="email"
              placeholder="name@phinmaed.edu.ph"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="auth-form__row">
            <div className="field">
              <label className="field-label" htmlFor="reg-role">Role</label>
              <select
                id="reg-role"
                className="field-control"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="School Staff">School Staff</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="reg-id">ID number</label>
              <input
                type="text"
                id="reg-id"
                className="field-control"
                required
                placeholder="2026-XXXX"
                value={idNumber}
                onChange={(event) => setIdNumber(event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-org">Organization / department</label>
            <select
              id="reg-org"
              className="field-control"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
            >
              <option value="SJCM General">SJCM General</option>
              <option value="SSC">Supreme Student Council (SSC)</option>
              <option value="IT Society">IT Society</option>
              <option value="HM Society">HM Society</option>
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-password">Password</label>
            <input
              type="password"
              id="reg-password"
              className="field-control"
              required
              autoComplete="new-password"
              placeholder="Choose a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="button button--primary button--block" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Creating account…' : 'Create account'}</span>
            <ArrowRight className="react-icon" aria-hidden="true" />
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </footer>
      </section>
    </main>
  );
}
