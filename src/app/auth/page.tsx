'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { Sparkles, Shield } from 'lucide-react';
import { insforge } from '@/lib/insforge';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPassword from '@/components/auth/ForgotPassword';
import UserProfileCard from '@/components/auth/UserProfileCard';
import ThemeToggle from '@/components/ui/ThemeToggle';

type AuthView = 'signin' | 'signup' | 'forgot' | 'profile';

function AuthContent() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>('signin');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const prevViewRef = useRef<AuthView>('signin');

  // Handle URL query parameters and check existing session
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') {
      setCurrentView('signup');
    } else if (tabParam === 'forgot') {
      setCurrentView('forgot');
    }

    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user && !error) {
          setCurrentUser(data.user);
          // Only auto-switch to profile if not explicitly requesting signup/forgot
          if (!tabParam) {
            setCurrentView('profile');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkUser();

    // Listen to auth state changes
    const unsubscribe = insforge.auth.onAuthStateChange?.((event: string) => {
      if (event === 'signedIn') {
        checkUser();
      } else if (event === 'signedOut') {
        setCurrentUser(null);
        setCurrentView('signin');
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [searchParams]);

  // Handle Sliding Convex Tab Indicator Animation
  useEffect(() => {
    if (currentView !== 'signin' && currentView !== 'signup') return;
    if (!indicatorRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(indicatorRef.current, {
        x: currentView === 'signin' ? 0 : '100%',
        duration: 0.32,
        ease: 'power2.out',
      });
    }, indicatorRef);

    return () => ctx.revert();
  }, [currentView]);

  // Stage Switch Animation using GSAP with memory-leak-safe gsap.context()
  useLayoutEffect(() => {
    if (isInitializing || !stageRef.current) return;
    if (prevViewRef.current === currentView) return;

    const isMovingRight = direction === 'right';
    prevViewRef.current = currentView;

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      if (!stage) return;

      // Apply will-change exclusively during active transition
      gsap.set(stage, { willChange: 'transform, opacity, filter' });

      gsap.fromTo(
        stage,
        {
          xPercent: isMovingRight ? 12 : -12,
          opacity: 0,
          filter: 'blur(5px)',
        },
        {
          xPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.36,
          ease: 'power3.out',
          onComplete: () => {
            // Remove will-change immediately to free GPU memory on mobile
            if (stage) {
              stage.style.willChange = 'auto';
              stage.style.filter = 'none';
            }
          },
        }
      );
    }, stageRef);

    return () => ctx.revert();
  }, [currentView, direction, isInitializing]);

  const transitionTo = (nextView: AuthView, newDirection: 'left' | 'right') => {
    setDirection(newDirection);
    setCurrentView(nextView);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 pb-safe pt-safe select-none transition-colors duration-200"
      style={{ backgroundColor: 'var(--neuro-base)' }}
    >
      {/* Subtle Ambient Radial Lighting in Background */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center -z-10"
        aria-hidden="true"
      >
        <div
          className="w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 dark:opacity-20 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, #6ea0f7 0%, rgba(110, 160, 247, 0) 70%)',
          }}
        />
      </div>

      {/* Top Bar: Brand Logo & Tactile Theme Switcher */}
      <header className="w-full max-w-md flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#6ea0f7] transition-all duration-200"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-flat-sm)',
            }}
          >
            <Shield className="w-5 h-5 fill-[#6ea0f7]/20" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[var(--neuro-text-primary)]">
              Antigravity <span className="text-[#6ea0f7]">Auth</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--neuro-text-muted)]">
              High-Performance 2.5D
            </p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Neuromorphic Resting Card Container */}
      <main
        className="relative w-full max-w-md p-6 sm:p-8 rounded-neuro-card transition-all duration-200"
        style={{
          backgroundColor: 'var(--neuro-base)',
          boxShadow: 'var(--neuro-flat)',
        }}
      >
        {/* Segmented Tactile Pill Navigation (visible for signin and signup) */}
        {(currentView === 'signin' || currentView === 'signup') && (
          <nav
            aria-label="Authentication Views"
            className="relative w-full p-1.5 rounded-full mb-6 flex items-center"
            style={{
              backgroundColor: 'var(--neuro-base)',
              boxShadow: 'var(--neuro-inset)',
            }}
          >
            {/* Sliding Convex Pill Indicator */}
            <div
              ref={indicatorRef}
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full pointer-events-none transition-shadow"
              style={{
                background: 'var(--neuro-convex)',
                boxShadow: 'var(--neuro-flat-sm)',
              }}
            />

            {/* Sign In Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={currentView === 'signin'}
              onClick={() => transitionTo('signin', 'left')}
              className={`relative z-10 w-1/2 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors duration-200 text-center outline-none focus:outline-none ${
                currentView === 'signin'
                  ? 'text-[#6ea0f7]'
                  : 'text-[var(--neuro-text-muted)] hover:text-[var(--neuro-text-primary)]'
              }`}
            >
              Sign In
            </button>

            {/* Sign Up Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={currentView === 'signup'}
              onClick={() => transitionTo('signup', 'right')}
              className={`relative z-10 w-1/2 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors duration-200 text-center outline-none focus:outline-none ${
                currentView === 'signup'
                  ? 'text-[#6ea0f7]'
                  : 'text-[var(--neuro-text-muted)] hover:text-[var(--neuro-text-primary)]'
              }`}
            >
              Sign Up
            </button>
          </nav>
        )}

        {/* Animated Stage Container (Zero CLS with flexible dynamic container) */}
        <div ref={stageRef} className="w-full">
          {currentView === 'signin' && (
            <SignInForm
              onSwitchToSignUp={() => transitionTo('signup', 'right')}
              onSwitchToForgotPassword={() => transitionTo('forgot', 'right')}
              onSuccess={(user) => {
                setCurrentUser(user);
                transitionTo('profile', 'right');
              }}
            />
          )}

          {currentView === 'signup' && (
            <SignUpForm
              onSwitchToSignIn={() => transitionTo('signin', 'left')}
              onSuccess={(user) => {
                setCurrentUser(user);
                transitionTo('profile', 'right');
              }}
            />
          )}

          {currentView === 'forgot' && (
            <ForgotPassword
              onBackToSignIn={() => transitionTo('signin', 'left')}
            />
          )}

          {currentView === 'profile' && (
            <UserProfileCard
              user={currentUser}
              onSignOut={() => {
                setCurrentUser(null);
                transitionTo('signin', 'left');
              }}
            />
          )}
        </div>
      </main>

      {/* Security & Architecture Badge */}
      <footer className="mt-8 text-center text-[11px] font-medium text-[var(--neuro-text-muted)] flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#6ea0f7]" />
        <span>Enterprise Neuromorphic Engine · Protected by InsForge</span>
      </footer>
    </div>
  );
}

export default function AuthPage() {
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
      <AuthContent />
    </Suspense>
  );
}
