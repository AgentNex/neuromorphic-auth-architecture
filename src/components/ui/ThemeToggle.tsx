'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('neuro-theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('neuro-theme', 'light');
      } catch {}
    }

    // Tactile micro-interaction using GSAP context for zero memory leaks
    if (buttonRef.current && iconContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.timeline()
          .to(buttonRef.current, {
            scale: 0.92,
            duration: 0.1,
            ease: 'power1.in',
          })
          .to(iconContainerRef.current, {
            rotation: nextDark ? 180 : 0,
            scale: 0.8,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
          }, 0)
          .to(buttonRef.current, {
            scale: 1,
            duration: 0.25,
            ease: 'back.out(2)',
          });
      }, buttonRef);

      return () => ctx.revert();
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-full neuro-pill flex items-center justify-center opacity-0" />
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 outline-none focus:outline-none focus:ring-2 focus:ring-[#6ea0f7] active:scale-95"
      style={{
        backgroundColor: 'var(--neuro-base)',
        boxShadow: isDark
          ? '5px 5px 12px #15151f, -5px -5px 12px #29293d'
          : '5px 5px 12px #d1d9e6, -5px -5px 12px #ffffff',
      }}
    >
      <div
        ref={iconContainerRef}
        className="w-full h-full flex items-center justify-center transition-colors duration-200"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[#6ea0f7] transition-transform duration-300" />
        ) : (
          <Sun className="w-5 h-5 text-[#6ea0f7] transition-transform duration-300" />
        )}
      </div>
    </button>
  );
}
