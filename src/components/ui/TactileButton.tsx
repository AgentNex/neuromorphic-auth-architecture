'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';

export interface TactileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function TactileButton({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: TactileButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    props.onPointerDown?.(e);

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.97,
        duration: 0.12,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    props.onPointerUp?.(e);

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.28,
        ease: 'back.out(1.7)',
        overwrite: 'auto',
      });
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    props.onPointerLeave?.(e);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
  };

  const getVariantStyles = () => {
    if (variant === 'primary') {
      return 'neuro-pill-primary text-white font-semibold';
    }
    if (variant === 'secondary') {
      return 'neuro-pill text-[var(--neuro-text-primary)] font-medium';
    }
    return 'bg-transparent text-[var(--neuro-text-muted)] hover:text-[var(--neuro-text-primary)]';
  };

  return (
    <button
      ref={buttonRef}
      disabled={disabled || isLoading}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={`relative w-full py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 text-sm tracking-wide transition-colors duration-150 outline-none focus:outline-none focus:ring-2 focus:ring-[#6ea0f7] focus:ring-offset-2 focus:ring-offset-[var(--neuro-base)] select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVariantStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
