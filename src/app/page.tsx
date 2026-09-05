'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  SunMoon,
  Layers,
  Fingerprint,
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import TactileButton from '@/components/ui/TactileButton';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser(data.user);
      }
    });
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[600px] rounded-full blur-[120px] opacity-25 dark:opacity-20"
          style={{
            background:
              'radial-gradient(circle, #6ea0f7 0%, rgba(110, 160, 247, 0) 70%)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#6ea0f7]"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-inset)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tactile 2.5D Neuromorphic Design DNA</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--neuro-text-primary)] leading-[1.15]">
            Next-Gen Auth With{' '}
            <span className="text-[#6ea0f7] underline decoration-[#6ea0f7]/30 decoration-wavy">
              Tactile Precision
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--neuro-text-muted)] leading-relaxed max-w-xl mx-auto">
            An enterprise-grade, high-performance authentication architecture
            featuring physical 135° dual-light shadows, GSAP micro-interactions,
            zero-latency dark mode, and InsForge native BaaS integration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
          <Link href="/auth" className="w-full sm:w-auto">
            <TactileButton variant="primary" className="px-8 py-4 text-base">
              <span>{currentUser ? 'Open My Profile' : 'Launch Auth Suite'}</span>
              <ArrowRight className="w-4 h-4" />
            </TactileButton>
          </Link>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <TactileButton variant="secondary" className="px-8 py-4 text-base">
              <span>Explore Dashboard</span>
            </TactileButton>
          </Link>
        </div>

        {/* 3-Dimensional Neuromorphic Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8 text-left">
          {/* Feature 1 */}
          <div
            className="p-6 rounded-neuro-card space-y-3 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6ea0f7]"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--neuro-text-primary)]">
              2.5D Dual-Light Surface
            </h2>
            <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed">
              Directional 135° dual light simulation with white highlights and
              soft diffuse shadows adhering strictly to WCAG AA contrast.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="p-6 rounded-neuro-card space-y-3 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6ea0f7]"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--neuro-text-primary)]">
              GSAP Memory Safety
            </h2>
            <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed">
              120ms tactile depressions, spring physics, and horizontal parallax
              blur-slips wrapped in gsap.context() with zero RAM leaks.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="p-6 rounded-neuro-card space-y-3 transition-transform hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6ea0f7]"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              <Fingerprint className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[var(--neuro-text-primary)]">
              InsForge Native Auth
            </h2>
            <p className="text-xs text-[var(--neuro-text-muted)] leading-relaxed">
              Email & password registration, real-time validation, password strength
              meter, Google SSO, and password reset flows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
