'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Mail } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import TactileButton from '../ui/TactileButton';

interface VerifyEmailFormProps {
  email: string;
  onSuccess?: (user: any) => void;
  onBackToSignUp?: () => void;
  onBackToSignIn?: () => void;
}

export default function VerifyEmailForm({
  email,
  onSuccess,
  onBackToSignUp,
  onBackToSignIn,
}: VerifyEmailFormProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty digit input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();

    // 60s cooldown timer for resend
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (generalError) setGeneralError(null);

    // Handle paste of multiple digits
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pastedDigits.length > 0) {
        const nextDigits = [...digits];
        pastedDigits.forEach((d, i) => {
          if (index + i < 6) {
            nextDigits[index + i] = d;
          }
        });
        setDigits(nextDigits);

        const nextFocusIndex = Math.min(index + pastedDigits.length, 5);
        inputRefs.current[nextFocusIndex]?.focus();

        // If all 6 digits filled, auto-trigger verify
        if (nextDigits.every((d) => d.length === 1)) {
          triggerVerification(nextDigits.join(''));
        }
      }
      return;
    }

    // Only allow numeric character
    const cleaned = value.replace(/\D/g, '');
    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    setDigits(nextDigits);

    // Advance focus if character entered
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-trigger when 6th digit entered
    if (cleaned && index === 5 && nextDigits.every((d) => d.length === 1)) {
      triggerVerification(nextDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const nextDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      nextDigits[i] = pasteData[i];
    }
    setDigits(nextDigits);

    const focusIdx = Math.min(pasteData.length, 5);
    inputRefs.current[focusIdx]?.focus();

    if (pasteData.length === 6) {
      triggerVerification(pasteData);
    }
  };

  const triggerVerification = async (otpCode: string) => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      // Execute verifyEmail via InsForge SDK
      const { data, error } = await insforge.auth.verifyEmail({
        email: email.trim(),
        otp: otpCode.trim(),
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);

      // Auto-redirect or notify success
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data?.user);
        } else if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 1000);
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        'Invalid or expired 6-digit verification code. Please check and try again.';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join('');
    if (otpCode.length < 6) {
      setGeneralError('Please enter all 6 digits of your verification code.');
      return;
    }
    triggerVerification(otpCode);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setGeneralError(null);
    setResendStatus(null);

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000';

      const { data, error } = await insforge.auth.resendVerificationEmail({
        email: email.trim(),
        redirectTo: `${origin}/auth`,
      });

      if (error) throw error;

      setResendStatus('A new 6-digit code has been sent to your email!');
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
    } catch (err: any) {
      setGeneralError(err?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
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
            Email Verified Successfully!
          </h3>
          <p className="text-xs text-[var(--neuro-text-muted)] max-w-xs mx-auto">
            Your account is now fully activated. Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
      {/* Header Info */}
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2 text-[#6ea0f7]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Email Verification
          </span>
        </div>
        <h2 className="text-xl font-bold text-[var(--neuro-text-primary)]">
          Enter 6-Digit Code
        </h2>
        <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed">
          We sent a verification code to{' '}
          <strong className="text-[var(--neuro-text-primary)] font-semibold break-all">
            {email}
          </strong>
          . Enter the code below to complete account activation.
        </p>
      </div>

      {/* Alert Error Message */}
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

      {/* Resend Status Notification */}
      {resendStatus && (
        <div
          role="status"
          className="p-3 rounded-2xl flex items-center gap-2 text-xs font-medium text-[#10b981] animate-in fade-in duration-200"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{resendStatus}</span>
        </div>
      )}

      {/* 6 Tactile Neuromorphic OTP Digit Boxes */}
      <div className="py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-2.5">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl text-center text-xl font-bold text-[var(--neuro-text-primary)] outline-none transition-all duration-200"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: digit
                  ? 'var(--neuro-inset-focus), 0 0 0 1.5px #6ea0f7'
                  : 'var(--neuro-inset)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Primary Submit Button */}
      <TactileButton
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="mt-2"
      >
        Verify & Activate Account
      </TactileButton>

      {/* Resend Code Section */}
      <div className="flex flex-col items-center justify-center gap-2 pt-1 text-center">
        <button
          type="button"
          disabled={resendCooldown > 0 || isLoading}
          onClick={handleResend}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--neuro-text-muted)] hover:text-[#6ea0f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : 'Didn’t receive a code? Resend'}
          </span>
        </button>

        {/* Change email or back to sign up */}
        <div className="flex items-center gap-3 pt-2 text-xs text-[var(--neuro-text-muted)]">
          {onBackToSignUp && (
            <button
              type="button"
              onClick={onBackToSignUp}
              className="hover:text-[var(--neuro-text-primary)] flex items-center gap-1 underline"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Wrong email? Change</span>
            </button>
          )}

          <span>•</span>

          {onBackToSignIn && (
            <button
              type="button"
              onClick={onBackToSignIn}
              className="hover:text-[#6ea0f7]"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
