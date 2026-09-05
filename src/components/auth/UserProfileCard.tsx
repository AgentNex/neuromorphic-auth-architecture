'use client';

import React, { useState } from 'react';
import { User, LogOut, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import TactileButton from '../ui/TactileButton';

interface UserProfileCardProps {
  user: any;
  onSignOut: () => void;
  onEnterVerificationCode?: (email: string) => void;
}

export default function UserProfileCard({
  user,
  onSignOut,
  onEnterVerificationCode,
}: UserProfileCardProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const displayName =
    user?.profile?.name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Authenticated User';

  const email = user?.email || 'No email available';
  const isVerified = Boolean(user?.emailVerified);
  const providers = user?.providers || ['email'];
  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await insforge.auth.signOut();
    } catch {}
    onSignOut();
    setIsSigningOut(false);
  };

  const handleResendVerification = async () => {
    if (resending) return;
    setResending(true);
    setResendStatus(null);
    try {
      const { error } = await insforge.auth.resendVerificationEmail({
        email,
      });
      if (error) throw error;
      setResendStatus('Verification email re-sent! Check your inbox.');
    } catch (err: any) {
      setResendStatus(err?.message || 'Failed to resend verification.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* User Header with Tactile Avatar */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-[#6ea0f7] transition-all duration-300"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-flat)',
          }}
        >
          {user?.profile?.avatar_url ? (
            <img
              src={user.profile.avatar_url}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="uppercase">{displayName.slice(0, 2)}</span>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-[var(--neuro-text-primary)]">
            {displayName}
          </h3>
          <p className="text-xs text-[var(--neuro-text-muted)] flex items-center justify-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{email}</span>
          </p>
        </div>

        {/* Verification Status Pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset)',
          }}
        >
          {isVerified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[#10b981]">Email Verified</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="text-[#f59e0b]">Pending Verification</span>
            </>
          )}
        </div>
      </div>

      {/* Account Info Well */}
      <div
        className="p-4 rounded-2xl space-y-2.5 text-xs text-[var(--neuro-text-muted)]"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-inset)',
        }}
      >
        <div className="flex justify-between items-center">
          <span>Auth Provider</span>
          <span className="font-semibold text-[var(--neuro-text-primary)] capitalize">
            {providers.join(', ')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Member Since</span>
          <span className="font-semibold text-[var(--neuro-text-primary)]">
            {createdDate}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Security Status</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#10b981]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Session
          </span>
        </div>
      </div>

      {/* Verification prompt if pending */}
      {!isVerified && (
        <div
          className="space-y-2 text-center p-3 rounded-2xl"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset)',
          }}
        >
          <p className="text-[11px] text-[var(--neuro-text-muted)]">
            Account activation pending email verification
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            {onEnterVerificationCode && (
              <button
                type="button"
                onClick={() => onEnterVerificationCode(email)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white neuro-pill-primary transition-transform active:scale-95"
              >
                Enter 6-Digit Code
              </button>
            )}
            <button
              type="button"
              disabled={resending}
              onClick={handleResendVerification}
              className="text-xs font-medium text-[#6ea0f7] hover:underline"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          </div>
          {resendStatus && (
            <p className="text-[11px] text-[#10b981] pt-1">{resendStatus}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        <a
          href="/dashboard"
          className="w-full block"
        >
          <TactileButton variant="primary">
            Open Platform Dashboard
          </TactileButton>
        </a>

        <TactileButton
          type="button"
          variant="secondary"
          isLoading={isSigningOut}
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 text-[#ef4444]" />
          <span className="text-[#ef4444]">Sign Out</span>
        </TactileButton>
      </div>
    </div>
  );
}
