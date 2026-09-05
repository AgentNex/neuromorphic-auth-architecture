'use client';

import React from 'react';
import { Check, Dot } from 'lucide-react';
import { calculatePasswordStrength } from '@/lib/validations';

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export default function PasswordStrengthMeter({
  password,
  showRequirements = true,
}: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  const requirementList = [
    { key: 'minLength', label: '8+ characters', met: strength.requirements.minLength },
    { key: 'hasUpper', label: 'Uppercase letter (A-Z)', met: strength.requirements.hasUpper },
    { key: 'hasLower', label: 'Lowercase letter (a-z)', met: strength.requirements.hasLower },
    { key: 'hasNumber', label: 'Number (0-9)', met: strength.requirements.hasNumber },
    { key: 'hasSpecial', label: 'Special character (!@#$...)', met: strength.requirements.hasSpecial },
  ];

  return (
    <div className="w-full mt-2 space-y-2.5 animate-in fade-in duration-200">
      {/* 4 Segmented Tactile Inset Bars */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isActive = strength.score >= step;
          return (
            <div
              key={step}
              className="h-2 flex-1 rounded-full overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: 'var(--neuro-base)',
                boxShadow: 'var(--neuro-inset)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '100%' : '0%',
                  backgroundColor: isActive ? strength.color : 'transparent',
                  boxShadow: isActive ? `0 0 8px ${strength.color}` : 'none',
                }}
              />
            </div>
          );
        })}
        <span
          className="text-xs font-semibold uppercase tracking-wider pl-2 min-w-[56px] text-right transition-colors duration-200"
          style={{ color: strength.color }}
        >
          {strength.label}
        </span>
      </div>

      {/* Requirement Criteria Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
          {requirementList.map((req) => (
            <div
              key={req.key}
              className={`flex items-center text-[11px] font-medium transition-colors duration-150 ${
                req.met
                  ? 'text-[#10b981]'
                  : 'text-[var(--neuro-text-muted)]'
              }`}
            >
              {req.met ? (
                <Check className="w-3 h-3 mr-1 text-[#10b981] flex-shrink-0" />
              ) : (
                <Dot className="w-3 h-3 mr-1 text-[var(--neuro-text-muted)] flex-shrink-0" />
              )}
              <span className="truncate">{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
