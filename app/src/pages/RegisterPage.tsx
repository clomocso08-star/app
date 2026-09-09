// src/pages/RegisterPage.tsx

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserRoundPlus, Eye, EyeOff, Mail, Lock, User, CreditCard } from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { registerUser } from '../services';
import type { UserRole } from '../types';

// Configurable constants
const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role] = useState<UserRole>('Student');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    idNumber?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate ID number
    if (!idNumber.trim()) {
      newErrors.idNumber = 'Student ID number is required.';
    } else if (idNumber.trim().length < 5) {
      newErrors.idNumber = 'ID number must be at least 5 characters.';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast('Please fix the errors before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser({
        name,
        email,
        role,
        idNumber,
        organization: 'SJCM General',
        password,
      });
      
      if (!result.success || !result.user) {
        toast(result.message, 'danger');
        return;
      }

      signIn(result.user);
      toast('Registration successful. Redirecting to your dashboard.', 'success');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      toast('Registration failed. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <main className="register-page">
      {/* Background Glow */}
      <div className="register-bg">
        <div className="register-glow glow-1"></div>
        <div className="register-glow glow-2"></div>
      </div>

      <div className="register-container glass">
        {/* Header */}
        <header className="register-header">
          <div className="register-icon">
            <UserRoundPlus className="react-icon" aria-hidden="true" />
          </div>
          <h1 className="register-title">Create a Student Account</h1>
          <p className="register-description">
            Register as a student to reserve SJCM uniforms and organization merchandise.
          </p>
        </header>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="register-field">
            <label className="register-label" htmlFor="register-name">
              <User className="react-icon" aria-hidden="true" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="register-name"
              className={`register-input glass-input ${errors.name ? 'register-input--error' : ''}`}
              placeholder="e.g. Juan dela Cruz"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && <span className="register-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="register-field">
            <label className="register-label" htmlFor="register-email">
              <Mail className="react-icon" aria-hidden="true" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              id="register-email"
              className={`register-input glass-input ${errors.email ? 'register-input--error' : ''}`}
              placeholder="name@phinmaed.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
            />
            {errors.email && <span className="register-error">{errors.email}</span>}
          </div>

          {/* ID Number */}
          <div className="register-field">
            <label className="register-label" htmlFor="register-id">
              <CreditCard className="react-icon" aria-hidden="true" />
              <span>Student ID Number</span>
            </label>
            <input
              type="text"
              id="register-id"
              className={`register-input glass-input ${errors.idNumber ? 'register-input--error' : ''}`}
              placeholder="2026-XXXX"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value);
                if (errors.idNumber) setErrors({ ...errors, idNumber: undefined });
              }}
            />
            {errors.idNumber && <span className="register-error">{errors.idNumber}</span>}
          </div>

          {/* Password */}
          <div className="register-field">
            <label className="register-label" htmlFor="register-password">
              <Lock className="react-icon" aria-hidden="true" />
              <span>Password</span>
            </label>
            <div className="register-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                className={`register-input glass-input ${errors.password ? 'register-input--error' : ''}`}
                placeholder="Choose a password (min. 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="react-icon" aria-hidden="true" />
                ) : (
                  <Eye className="react-icon" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && <span className="register-error">{errors.password}</span>}
            <p className="register-hint">Password must be at least 6 characters long.</p>
          </div>

          {/* Confirm Password */}
          <div className="register-field">
            <label className="register-label" htmlFor="register-confirm-password">
              <Lock className="react-icon" aria-hidden="true" />
              <span>Confirm Password</span>
            </label>
            <div className="register-password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="register-confirm-password"
                className={`register-input glass-input ${errors.confirmPassword ? 'register-input--error' : ''}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
              />
              <button
                type="button"
                className="register-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="react-icon" aria-hidden="true" />
                ) : (
                  <Eye className="react-icon" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="register-submit glass-btn"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create account'}</span>
            <ArrowRight className="react-icon" aria-hidden="true" />
          </button>
        </form>

        {/* Footer */}
        <footer className="register-footer">
          Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </footer>
      </div>
    </main>
  );
}