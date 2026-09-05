'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Sparkles } from 'lucide-react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const errorParam = searchParams.get('insforge_error');

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 pb-safe pt-safe select-none transition-colors duration-200"
      style={{ backgroundColor: 'var(--neuro-base)' }}
    >
      {/* Top Bar */}
      <header className="w-full max-w-md flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#6ea0f7]"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat-sm)',
            }}
          >
            <Shield className="w-5 h-5 fill-[#6ea0f7]/20" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--neuro-text-primary)]">
              Antigravity <span className="text-[#6ea0f7]">Security</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--neuro-text-muted)]">
              Password Reset
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Resting Card */}
      <main
        className="relative w-full max-w-md p-6 sm:p-8 rounded-neuro-card transition-all duration-200"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-flat)',
        }}
      >
        {errorParam && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-2xl text-xs font-medium text-[#ef4444]"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset), 0 0 0 1px rgba(239, 68, 68, 0.4)',
            }}
          >
            {errorParam}
          </div>
        )}

        <ResetPasswordForm initialToken={token} />
      </main>

      <footer className="mt-8 text-center text-[11px] font-medium text-[var(--neuro-text-muted)] flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#6ea0f7]" />
        <span>Enterprise Neuromorphic Engine · Protected by InsForge</span>
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen w-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--neuro-base)' }}
        >
          <div className="w-8 h-8 rounded-full animate-spin border-2 border-[#6ea0f7] border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
