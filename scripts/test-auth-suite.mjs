import assert from 'node:assert';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
  calculatePasswordStrength,
} from '../src/lib/validations.ts';
import { insforge } from '../src/lib/insforge.ts';

async function runTests() {
  console.log('--- 1. Testing Validation Logic ---');

  // Email validation
  assert.strictEqual(validateEmail('').isValid, false, 'Empty email must fail');
  assert.strictEqual(validateEmail('not-an-email').isValid, false, 'Invalid email format must fail');
  assert.strictEqual(validateEmail('test@example.com').isValid, true, 'Valid email must pass');
  assert.strictEqual(validateEmail('user.name+tag@sub.domain.co').isValid, true, 'Complex valid email must pass');
  console.log('✓ Email validation tests passed');

  // Name validation
  assert.strictEqual(validateName('').isValid, false, 'Empty name must fail');
  assert.strictEqual(validateName('a').isValid, false, 'Single character name must fail');
  assert.strictEqual(validateName('Alex Rivera').isValid, true, 'Valid name must pass');
  console.log('✓ Name validation tests passed');

  // Password validation
  assert.strictEqual(validatePassword('').isValid, false, 'Empty password must fail');
  assert.strictEqual(validatePassword('12345').isValid, false, 'Short password must fail');
  assert.strictEqual(validatePassword('123456').isValid, true, '6-char password passes min check');
  console.log('✓ Password basic validation tests passed');

  // Password match
  assert.strictEqual(validatePasswordMatch('Pass123!', 'Pass123!').isValid, true, 'Matching passwords pass');
  assert.strictEqual(validatePasswordMatch('Pass123!', 'Pass456!').isValid, false, 'Mismatching passwords fail');
  console.log('✓ Password match validation tests passed');

  // Password Strength Regex calculation (zero external weights)
  const weakStr = calculatePasswordStrength('pass');
  assert.strictEqual(weakStr.score, 1, 'Short lower password is weak');
  assert.strictEqual(weakStr.label, 'Weak');

  const fairStr = calculatePasswordStrength('Password1');
  assert.strictEqual(fairStr.score >= 2, true, 'Password with Upper, Lower, Number is at least fair');

  const strongStr = calculatePasswordStrength('P@ssw0rd2026!#');
  assert.strictEqual(strongStr.score, 4, 'Complex password with all criteria is strong');
  assert.strictEqual(strongStr.label, 'Strong');
  assert.strictEqual(strongStr.requirements.minLength, true);
  assert.strictEqual(strongStr.requirements.hasUpper, true);
  assert.strictEqual(strongStr.requirements.hasLower, true);
  assert.strictEqual(strongStr.requirements.hasNumber, true);
  assert.strictEqual(strongStr.requirements.hasSpecial, true);
  console.log('✓ Password strength calculation tests passed');

  console.log('\n--- 2. Testing InsForge SDK Integration ---');
  const baseUrl = insforge.http?.baseUrl || process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://q7hwjwtx.ap-southeast.insforge.app';
  console.log('Testing InsForge Client BaseURL:', baseUrl);
  assert.ok(baseUrl.includes('insforge.app'), 'Base URL must point to InsForge');

  // Test invalid login handling (verifying structured error handling)
  console.log('Testing signInWithPassword structured error handling...');
  const { data: signinData, error: signinError } = await insforge.auth.signInWithPassword({
    email: 'nonexistent_test_user_9999@example.com',
    password: 'WrongPassword123!',
  });
  assert.ok(signinError, 'Should return error for invalid credentials');
  console.log('✓ InsForge returned expected error for bad credentials:', signinError.message || signinError);

  // Test reset password email endpoint
  console.log('Testing sendResetPasswordEmail endpoint...');
  const { data: resetData, error: resetError } = await insforge.auth.sendResetPasswordEmail({
    email: 'test_recovery_user@example.com',
    redirectTo: 'http://localhost:3000/auth/reset-password',
  });
  console.log('✓ InsForge sendResetPasswordEmail executed:', resetData || resetError);

  console.log('\n--- 3. Testing HTTP Server Endpoints ---');
  const routes = ['/', '/auth', '/auth?tab=signup', '/auth?tab=forgot', '/auth/reset-password', '/dashboard'];
  for (const route of routes) {
    const res = await fetch(`http://localhost:3000${route}`);
    assert.strictEqual(res.status, 200, `Route ${route} must return status 200`);
    const text = await res.text();
    assert.ok(text.length > 500, `Route ${route} must return non-empty HTML`);
    console.log(`✓ Endpoint http://localhost:3000${route} returned HTTP 200 (length: ${text.length} bytes)`);
  }

  console.log('\n=============================================');
  console.log('🎉 ALL NEUROMORPHIC AUTH SUITE TESTS PASSED!');
  console.log('=============================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
