/**
 * Minimalist form validation and password strength calculation
 * Zero external dependencies for ultra-low memory footprint
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  requirements: PasswordRequirements;
}

/**
 * Validate standard email format RFC 5322 compatible
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

/**
 * Validate full name
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'Full name is required.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters.' };
  }
  return { isValid: true };
}

/**
 * Basic password validation for login
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters.' };
  }
  return { isValid: true };
}

/**
 * Validate password match for registration / reset
 */
export function validatePasswordMatch(password: string, confirm: string): ValidationResult {
  if (!confirm) {
    return { isValid: false, message: 'Please confirm your password.' };
  }
  if (password !== confirm) {
    return { isValid: false, message: 'Passwords do not match.' };
  }
  return { isValid: true };
}

/**
 * Instant visual password strength indicator calculated via regex without external weight
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements: PasswordRequirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let metCount = 0;
  if (requirements.minLength) metCount++;
  if (requirements.hasUpper) metCount++;
  if (requirements.hasLower) metCount++;
  if (requirements.hasNumber) metCount++;
  if (requirements.hasSpecial) metCount++;

  let score = 0;
  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  let color = '#ef4444'; // Red

  if (!password) {
    score = 0;
    label = 'Weak';
    color = '#ef4444';
  } else if (metCount <= 2) {
    score = 1;
    label = 'Weak';
    color = '#ef4444';
  } else if (metCount === 3) {
    score = 2;
    label = 'Fair';
    color = '#f59e0b'; // Amber
  } else if (metCount === 4) {
    score = 3;
    label = 'Good';
    color = '#6ea0f7'; // Royal Blue Accent
  } else {
    score = 4;
    label = 'Strong';
    color = '#10b981'; // Emerald
  }

  return {
    score,
    label,
    color,
    requirements,
  };
}
