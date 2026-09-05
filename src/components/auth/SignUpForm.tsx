'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
  calculatePasswordStrength,
} from '@/lib/validations';
import NeuromorphicInput from './NeuromorphicInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import GoogleAuthButton from './GoogleAuthButton';
import TactileButton from '../ui/TactileButton';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess?: (user: any) => void;
  onRequireVerification?: (email: string) => void;
}

export default function SignUpForm({
  onSwitchToSignIn,
  onSuccess,
  onRequireVerification,
}: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    requireVerification: boolean;
  } | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const validateField = (field: string, value: string) => {
    if (field === 'name') {
      const res = validateName(value);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : res.message }));
    }
    if (field === 'email') {
      const res = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : res.message }));
    }
    if (field === 'password') {
      const res = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: res.isValid ? undefined : res.message }));
      if (touched.confirmPassword) {
        const matchRes = validatePasswordMatch(value, confirmPassword);
        setErrors((prev) => ({ ...prev, confirmPassword: matchRes.isValid ? undefined : matchRes.message }));
      }
    }
    if (field === 'confirmPassword') {
      const res = validatePasswordMatch(password, value);
      setErrors((prev) => ({ ...prev, confirmPassword: res.isValid ? undefined : res.message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    setGeneralError(null);

    const nameVal = validateName(name);
    const emailVal = validateEmail(email);
    const passVal = validatePassword(password);
    const matchVal = validatePasswordMatch(password, confirmPassword);

    if (!nameVal.isValid || !emailVal.isValid || !passVal.isValid || !matchVal.isValid) {
      setErrors({
        name: nameVal.message,
        email: emailVal.message,
        password: passVal.message,
        confirmPassword: matchVal.message,
      });
      return;
    }

    const strength = calculatePasswordStrength(password);
    if (strength.score < 2) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password is too weak. Please include letters and numbers.',
      }));
      return;
    }

    setIsLoading(true);

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000';

      // Direct execution via InsForge SDK
      const { data, error } = await insforge.auth.signUp({
        email: email.trim(),
        password,
        name: name.trim(),
        redirectTo: `${origin}/auth`,
      });

      if (error) {
        throw error;
      }

      if (data?.requireEmailVerification) {
        setSuccessInfo({
          message:
            'Account created! A 6-digit code has been sent to your email. Redirecting to verification...',
          requireVerification: true,
        });

        setTimeout(() => {
          if (onRequireVerification) {
            onRequireVerification(email.trim());
          }
        }, 800);
      } else {
        setSuccessInfo({
          message: 'Account created successfully! Logging you in...',
          requireVerification: false,
        });

        setTimeout(() => {
          if (onSuccess && data?.user) {
            onSuccess(data.user);
          } else if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 800);
      }
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        'Registration failed. Please check your information and try again.';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
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

      {successInfo && (
        <div
          role="status"
          className="p-4 rounded-2xl flex flex-col gap-2 text-xs font-medium text-[#10b981] animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(16, 185, 129, 0.4)',
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{successInfo.message}</span>
          </div>
          {successInfo.requireVerification && (
            <div className="pl-6 space-y-1">
              <p className="text-[var(--neuro-text-muted)] text-[11px]">
                Please enter the 6-digit code from your email to activate your account.
              </p>
              {onRequireVerification && (
                <button
                  type="button"
                  onClick={() => onRequireVerification(email.trim())}
                  className="text-xs font-bold text-[#6ea0f7] hover:underline block pt-0.5"
                >
                  Enter 6-digit code now →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full Name Input */}
      <NeuromorphicInput
        label="Full Name"
        id="signup-name"
        type="text"
        autoComplete="name"
        required
        placeholder="Alex Rivera"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (touched.name) validateField('name', e.target.value);
          if (generalError) setGeneralError(null);
        }}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, name: true }));
          validateField('name', name);
        }}
        error={touched.name ? errors.name : undefined}
        icon={<User className="w-4 h-4" />}
      />

      {/* Email Input */}
      <NeuromorphicInput
        label="Email Address"
        id="signup-email"
        type="email"
        autoComplete="email"
        required
        placeholder="alex.rivera@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (touched.email) validateField('email', e.target.value);
          if (generalError) setGeneralError(null);
        }}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, email: true }));
          validateField('email', email);
        }}
        error={touched.email ? errors.email : undefined}
        icon={<Mail className="w-4 h-4" />}
      />

      {/* Password Input & Instant Visual Strength Meter */}
      <div className="space-y-1">
        <NeuromorphicInput
          label="Password"
          id="signup-password"
          required
          autoComplete="new-password"
          placeholder="••••••••••••"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (touched.password) validateField('password', e.target.value);
            if (generalError) setGeneralError(null);
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }));
            validateField('password', password);
          }}
          error={touched.password ? errors.password : undefined}
          icon={<Lock className="w-4 h-4" />}
        />

        {/* Visual Strength Meter */}
        <PasswordStrengthMeter password={password} />
      </div>

      {/* Confirm Password Input */}
      <NeuromorphicInput
        label="Confirm Password"
        id="signup-confirm-password"
        required
        autoComplete="new-password"
        placeholder="••••••••••••"
        showPasswordToggle
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (touched.confirmPassword) validateField('confirmPassword', e.target.value);
          if (generalError) setGeneralError(null);
        }}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, confirmPassword: true }));
          validateField('confirmPassword', confirmPassword);
        }}
        error={touched.confirmPassword ? errors.confirmPassword : undefined}
        icon={<Lock className="w-4 h-4" />}
      />

      {/* Primary Submit Button */}
      <TactileButton
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-2"
      >
        Create Account
      </TactileButton>

      {/* Tactile Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div
          className="w-full h-[2px] rounded-full"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset)',
          }}
        />
        <span className="absolute px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--neuro-text-muted)] bg-[var(--neuro-base)]">
          Or sign up with
        </span>
      </div>

      {/* Google SSO Button */}
      <GoogleAuthButton
        onError={(err) => setGeneralError(err)}
        label="Sign Up with Google"
      />

      {/* Footer Switcher */}
      <p className="text-center text-xs text-[var(--neuro-text-muted)] pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-[#6ea0f7] hover:underline outline-none focus:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
