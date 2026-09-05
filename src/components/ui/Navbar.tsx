'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Sparkles, UserCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { insforge } from '@/lib/insforge';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
        }
      } catch {}
    };

    fetchUser();

    const unsub = insforge.auth.onAuthStateChange?.((event: string) => {
      if (event === 'signedIn') {
        fetchUser();
      } else if (event === 'signedOut') {
        setUser(null);
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [pathname]);

  // For /auth pages, the auth container has its own dedicated top bar
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-colors duration-200">
      <div
        className="max-w-7xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-flat-sm)',
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 outline-none">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6ea0f7]"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset)',
            }}
          >
            <Shield className="w-4 h-4 fill-[#6ea0f7]/20" />
          </div>
          <span className="font-bold text-sm tracking-tight text-[var(--neuro-text-primary)]">
            Antigravity <span className="text-[#6ea0f7]">Platform</span>
          </span>
        </Link>

        {/* Navigation items */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-[var(--neuro-text-muted)]">
          <Link
            href="/auth"
            className={`transition-colors hover:text-[#6ea0f7] ${
              pathname === '/auth' ? 'text-[#6ea0f7]' : ''
            }`}
          >
            Auth Suite
          </Link>
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-[#6ea0f7] ${
              pathname === '/dashboard' ? 'text-[#6ea0f7]' : ''
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className={`transition-colors hover:text-[#6ea0f7] ${
              pathname === '/pricing' ? 'text-[#6ea0f7]' : ''
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/settings"
            className={`transition-colors hover:text-[#6ea0f7] ${
              pathname === '/settings' ? 'text-[#6ea0f7]' : ''
            }`}
          >
            Settings
          </Link>
        </nav>

        {/* Right side: User & Theme Toggle */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#10b981]"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {user.profile?.name || user.email?.split('@')[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white neuro-pill-primary transition-transform active:scale-95"
            >
              Sign In
            </Link>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
