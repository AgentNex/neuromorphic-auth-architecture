'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  Activity,
  ShieldCheck,
  User,
  LogOut,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { insforge } from '@/lib/insforge';
import TactileButton from '@/components/ui/TactileButton';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
    } catch {}
    setUser(null);
  };

  const displayName =
    user?.profile?.name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Guest Explorer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div
        className="p-6 sm:p-8 rounded-neuro-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-flat)',
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#6ea0f7] text-lg font-bold"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              {user ? (
                user.profile?.avatar_url ? (
                  <img
                    src={user.profile.avatar_url}
                    alt={displayName}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  displayName.slice(0, 2).toUpperCase()
                )
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--neuro-text-primary)]">
                Welcome back, {displayName}!
              </h1>
              <p className="text-xs text-[var(--neuro-text-muted)] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6ea0f7]" />
                <span>
                  {user
                    ? `Authenticated session via InsForge (${user.email})`
                    : 'Viewing platform as guest'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {user ? (
            <TactileButton
              variant="secondary"
              onClick={handleSignOut}
              className="w-full sm:w-auto px-5 py-2.5 text-xs text-[#ef4444]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </TactileButton>
          ) : (
            <Link href="/auth" className="w-full sm:w-auto">
              <TactileButton variant="primary" className="w-full sm:w-auto px-6 py-2.5 text-xs">
                <span>Sign In to Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </TactileButton>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="p-6 rounded-neuro-card space-y-2 transition-transform hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-flat)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--neuro-text-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Authentications
            </span>
            <Users className="w-4 h-4 text-[#6ea0f7]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--neuro-text-primary)]">
            14,892
          </p>
          <p className="text-[11px] text-[#10b981] font-medium flex items-center gap-1">
            <span>↑ 18.4%</span>
            <span className="text-[var(--neuro-text-muted)]">from last month</span>
          </p>
        </div>

        <div
          className="p-6 rounded-neuro-card space-y-2 transition-transform hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-flat)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--neuro-text-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Session Tokens
            </span>
            <Activity className="w-4 h-4 text-[#6ea0f7]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--neuro-text-primary)]">
            1,438
          </p>
          <p className="text-[11px] text-[#10b981] font-medium flex items-center gap-1">
            <span>● Healthy</span>
            <span className="text-[var(--neuro-text-muted)]">Zero latency spikes</span>
          </p>
        </div>

        <div
          className="p-6 rounded-neuro-card space-y-2 transition-transform hover:-translate-y-1"
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: 'var(--neuro-flat)',
          }}
        >
          <div className="flex items-center justify-between text-[var(--neuro-text-muted)]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              InsForge BaaS Health
            </span>
            <CreditCard className="w-4 h-4 text-[#6ea0f7]" />
          </div>
          <p className="text-3xl font-extrabold text-[var(--neuro-text-primary)]">
            99.99%
          </p>
          <p className="text-[11px] text-[#6ea0f7] font-medium flex items-center gap-1">
            <span>Region: ap-southeast</span>
          </p>
        </div>
      </div>

      {/* Security Status Well */}
      <div
        className="p-6 rounded-neuro-card space-y-4"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-flat)',
        }}
      >
        <h2 className="text-lg font-bold text-[var(--neuro-text-primary)]">
          Security & Identity Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-2xl space-y-2"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--neuro-text-primary)]">
                Email Verification
              </span>
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#10b981] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-[#f59e0b] font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pending
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--neuro-text-muted)]">
              {user?.emailVerified
                ? 'Your email address is verified and secure.'
                : 'Please check your inbox to confirm your email address.'}
            </p>
          </div>

          <div
            className="p-4 rounded-2xl space-y-2"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--neuro-text-primary)]">
                OAuth Providers
              </span>
              <span className="text-xs font-semibold text-[#6ea0f7]">
                Google SSO Enabled
              </span>
            </div>
            <p className="text-xs text-[var(--neuro-text-muted)]">
              Seamless single sign-on with Google accounts and PKCE security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
