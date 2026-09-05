'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { validateEmail, validatePassword } from '@/lib/validations';
import NeuromorphicInput from './NeuromorphicInput';
import GoogleAuthButton from './GoogleAuthButton';
import TactileButton from '../ui/TactileButton';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
  onSwitchToVerify?: (email: string) => void;
  onSuccess?: (user: any) => void;
}

export default function SignInForm({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
  onSwitchToVerify,
  onSuccess,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Restore remembered email on initial client render
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('neuro_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {}
  }, []);

  // Real-time validation
  const validateField = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      const res = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : res.message }));
    }
    if (field === 'password') {
      const res = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: res.isValid ? undefined : res.message }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) validateField('email', val);
    if (generalError) setGeneralError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) validateField('password', val);
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setGeneralError(null);

    const emailVal = validateEmail(email);
    const passVal = validatePassword(password);

    if (!emailVal.isValid || !passVal.isValid) {
      setErrors({
        email: emailVal.message,
        password: passVal.message,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Direct execution via InsForge SDK
      const { data, error } = await insforge.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        try {
          localStorage.setItem('neuro_remember_email', email.trim());
        } catch {}
      } else {
        try {
          localStorage.removeItem('neuro_remember_email');
        } catch {}
      }

      setSuccessMessage('Authentication successful! Welcome back.');

      setTimeout(() => {
        if (onSuccess && data?.user) {
          onSuccess(data.user);
        } else if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 700);
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        'Invalid email or password. Please check your credentials.';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
      {/* Alert Messages */}
      {generalError && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl flex items-start gap-3 text-xs font-medium text-[#ef4444] animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(239, 68, 68, 0.4)',
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-2xl flex items-center gap-3 text-xs font-medium text-[#10b981] animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Email Input */}
      <NeuromorphicInput
        label="Email Address"
        id="signin-email"
        type="email"
        autoComplete="email"
        required
        placeholder="alex.rivera@example.com"
        value={email}
        onChange={handleEmailChange}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, email: true }));
          validateField('email', email);
        }}
        error={touched.email ? errors.email : undefined}
        icon={<Mail className="w-4 h-4" />}
      />

      {/* Password Input */}
      <div className="space-y-1">
        <NeuromorphicInput
          label="Password"
          id="signin-password"
          required
          autoComplete="current-password"
          placeholder="••••••••••••"
          showPasswordToggle
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }));
            validateField('password', password);
          }}
          error={touched.password ? errors.password : undefined}
          icon={<Lock className="w-4 h-4" />}
        />

        {/* Controls Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Tactile Remember Me Switch */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <button
              type="button"
              role="checkbox"
              aria-checked={rememberMe}
              onClick={() => setRememberMe(!rememberMe)}
              className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-[#6ea0f7]"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: rememberMe
                  ? 'var(--neuro-inset), 0 0 0 1.5px #6ea0f7'
                  : 'var(--neuro-inset)',
              }}
            >
              {rememberMe && (
                <span className="w-2.5 h-2.5 rounded-sm bg-[#6ea0f7] transition-transform duration-150" />
              )}
            </button>
            <span className="text-xs font-medium text-[var(--neuro-text-muted)] group-hover:text-[var(--neuro-text-primary)] transition-colors">
              Remember me
            </span>
          </label>

          {/* Smooth transition button to "Forgot Password" */}
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-xs font-semibold text-[#6ea0f7] hover:underline outline-none focus:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Primary Submit Button */}
      <TactileButton
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-2"
      >
        Sign In to Account
      </TactileButton>

      {/* Tactile Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div
          className="w-full h-[2px] rounded-full"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset)',
          }}
        />
        <span className="absolute px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--neuro-text-muted)] bg-[var(--neuro-base)]">
          Or continue with
        </span>
      </div>

      {/* Google SSO Button */}
      <GoogleAuthButton
        onError={(err) => setGeneralError(err)}
        label="Sign In with Google"
      />

      {/* Footer Switcher */}
      <div className="text-center text-xs text-[var(--neuro-text-muted)] pt-2 space-y-1">
        <p>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-[#6ea0f7] hover:underline outline-none focus:underline"
          >
            Create account
          </button>
        </p>
        {onSwitchToVerify && (
          <p>
            <button
              type="button"
              onClick={() => onSwitchToVerify(email)}
              className="text-[11px] font-medium text-[var(--neuro-text-muted)] hover:text-[#6ea0f7] transition-colors"
            >
              Have a 6-digit verification code? Enter it here
            </button>
          </p>
        )}
      </div>
    </form>
  );
}
