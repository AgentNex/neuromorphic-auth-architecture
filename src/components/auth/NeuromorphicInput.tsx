'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface NeuromorphicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  showPasswordToggle?: boolean;
}

export const NeuromorphicInput = forwardRef<HTMLInputElement, NeuromorphicInputProps>(
  (
    {
      label,
      id,
      error,
      icon,
      helperText,
      type = 'text',
      className = '',
      showPasswordToggle = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wide uppercase text-[var(--neuro-text-muted)] transition-colors duration-150 pl-1"
        >
          {label}
        </label>

        <div
          className={`relative w-full rounded-2xl transition-all duration-200 flex items-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            backgroundColor: 'var(--neuro-base)',
            boxShadow: error
              ? 'var(--neuro-inset), 0 0 0 2px #ef4444, 0 0 10px rgba(239, 68, 68, 0.3)'
              : isFocused
              ? 'var(--neuro-inset-focus), var(--neuro-focus-ring)'
              : 'var(--neuro-inset)',
          }}
        >
          {icon && (
            <div className="pl-4 pr-1 text-[var(--neuro-text-muted)] flex items-center justify-center pointer-events-none transition-colors duration-150">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`w-full py-3.5 px-4 bg-transparent outline-none text-sm text-[var(--neuro-text-primary)] placeholder-[var(--neuro-text-muted)] rounded-2xl font-normal transition-colors duration-150 ${
              icon ? 'pl-2' : ''
            } ${showPasswordToggle ? 'pr-11' : ''} ${className}`}
            {...props}
          />

          {showPasswordToggle && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--neuro-text-muted)] hover:text-[#6ea0f7] transition-colors duration-150 outline-none focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs font-medium text-[#ef4444] pl-1 animate-in fade-in duration-150 flex items-center gap-1"
          >
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p
            id={`${id}-helper`}
            className="text-xs text-[var(--neuro-text-muted)] pl-1"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

NeuromorphicInput.displayName = 'NeuromorphicInput';

export default NeuromorphicInput;
