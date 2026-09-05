'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import { validateEmail } from '@/lib/validations';
import NeuromorphicInput from './NeuromorphicInput';
import TactileButton from '../ui/TactileButton';

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

export default function ForgotPassword({ onBackToSignIn }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.message || 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000';

      // Send password reset email via InsForge
      const { data, error: resetErr } = await insforge.auth.sendResetPasswordEmail({
        email: email.trim(),
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (resetErr) {
        throw resetErr;
      }

      setIsSuccess(true);
      startCooldown();
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        'Unable to send reset email. Please verify your address and try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000';

      const { error: resetErr } = await insforge.auth.sendResetPasswordEmail({
        email: email.trim(),
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (resetErr) throw resetErr;
      startCooldown();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Tactile Success Badge */}
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat)',
            }}
          >
            <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[var(--neuro-text-primary)]">
            Reset Link Dispatched
          </h3>
          <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed max-w-xs mx-auto">
            We sent a password recovery link to{' '}
            <strong className="text-[var(--neuro-text-primary)] font-semibold">
              {email}
            </strong>
            . Check your inbox and follow the instructions.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-2xl flex items-center gap-2 text-xs font-medium text-[#ef4444]"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(239, 68, 68, 0.4)',
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Back to Login Transition CTA */}
          <TactileButton
            type="button"
            variant="primary"
            onClick={onBackToSignIn}
          >
            Back to Sign In
          </TactileButton>

          {/* Resend button */}
          <button
            type="button"
            disabled={resendCooldown > 0 || isLoading}
            onClick={handleResend}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--neuro-text-muted)] hover:text-[#6ea0f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : 'Didn’t receive it? Resend link'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
      <div className="space-y-1.5 text-left">
        <h3 className="text-xl font-bold text-[var(--neuro-text-primary)]">
          Password Recovery
        </h3>
        <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed">
          Enter your registered email below and we will send you a secure link to reset your password.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl flex items-start gap-3 text-xs font-medium text-[#ef4444] animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(239, 68, 68, 0.4)',
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <NeuromorphicInput
        label="Account Email"
        id="forgot-email"
        type="email"
        autoComplete="email"
        required
        placeholder="alex.rivera@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        icon={<Mail className="w-4 h-4" />}
      />

      <TactileButton
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-2"
      >
        Send Recovery Link
      </TactileButton>

      {/* Back to Sign In button */}
      <button
        type="button"
        onClick={onBackToSignIn}
        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[var(--neuro-text-muted)] hover:text-[var(--neuro-text-primary)] transition-colors py-2 outline-none focus:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Sign In</span>
      </button>
    </form>
  );
}
