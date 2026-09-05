'use client';

import React, { useState } from 'react';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import {
  validatePassword,
  validatePasswordMatch,
  calculatePasswordStrength,
} from '@/lib/validations';
import NeuromorphicInput from './NeuromorphicInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import TactileButton from '../ui/TactileButton';

interface ResetPasswordFormProps {
  initialToken?: string;
  onSuccess?: () => void;
}

export default function ResetPasswordForm({
  initialToken = '',
  onSuccess,
}: ResetPasswordFormProps) {
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [errors, setErrors] = useState<{
    token?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!token.trim()) {
      setErrors((prev) => ({ ...prev, token: 'Reset token or code is required.' }));
      return;
    }

    const passVal = validatePassword(password);
    const matchVal = validatePasswordMatch(password, confirmPassword);

    if (!passVal.isValid || !matchVal.isValid) {
      setErrors({
        password: passVal.message,
        confirmPassword: matchVal.message,
      });
      return;
    }

    const strength = calculatePasswordStrength(password);
    if (strength.score < 2) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password is too weak. Please choose a stronger password.',
      }));
      return;
    }

    setIsLoading(true);

    try {
      // Execute resetPassword with InsForge
      const { data, error } = await insforge.auth.resetPassword({
        newPassword: password,
        otp: token.trim(),
      });

      if (error) {
        throw error;
      }

      setIsCompleted(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else if (typeof window !== 'undefined') {
          window.location.href = '/auth?tab=signin';
        }
      }, 1500);
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        'Failed to reset password. The token may be expired or invalid.';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat)',
            }}
          >
            <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-[var(--neuro-text-primary)]">
            Password Updated!
          </h3>
          <p className="text-xs text-[var(--neuro-text-muted)]">
            Your password has been reset successfully. Redirecting you to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
      <div className="space-y-1 text-left">
        <h3 className="text-xl font-bold text-[var(--neuro-text-primary)]">
          Set New Password
        </h3>
        <p className="text-xs text-[var(--neuro-text-muted)]">
          Choose a secure, strong password to protect your account.
        </p>
      </div>

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

      {/* If token is not provided via query string, allow entering code */}
      {!initialToken && (
        <NeuromorphicInput
          label="Verification Code / Token"
          id="reset-token"
          required
          placeholder="Enter 6-digit code or link token"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }));
          }}
          error={errors.token}
        />
      )}

      <div className="space-y-1">
        <NeuromorphicInput
          label="New Password"
          id="reset-new-password"
          required
          autoComplete="new-password"
          placeholder="••••••••••••"
          showPasswordToggle
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          icon={<Lock className="w-4 h-4" />}
        />
        <PasswordStrengthMeter password={password} />
      </div>

      <NeuromorphicInput
        label="Confirm New Password"
        id="reset-confirm-password"
        required
        autoComplete="new-password"
        placeholder="••••••••••••"
        showPasswordToggle
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={errors.confirmPassword}
        icon={<Lock className="w-4 h-4" />}
      />

      <TactileButton
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-2"
      >
        Update Password
      </TactileButton>

      <div className="text-center pt-2">
        <a
          href="/auth"
          className="text-xs font-semibold text-[#6ea0f7] hover:underline"
        >
          Return to Sign In
        </a>
      </div>
    </form>
  );
}
