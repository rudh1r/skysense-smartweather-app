/**
 * Authentication Helper Functions
 * Utilities for handling authentication with Supabase
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

// ============================================================================
// SIGN UP / SIGN IN
// ============================================================================

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      // This is crucial for client-side OAuth flows
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    throw error;
  }

  return data;
}

/**
 * Update password (must be called after password reset email)
 */
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Password update error:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Get session error:', error);
    return null;
  }

  return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Get user error:', error);
    return null;
  }

  return data.user;
}

/**
 * Refresh session
 */
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error('Refresh session error:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    console.error('Resend verification error:', error);
    throw error;
  }

  return data;
}

/**
 * Verify OTP (One-Time Password)
 */
export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    console.error('OTP verification error:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// USER UPDATES
// ============================================================================

/**
 * Update user email
 */
export async function updateEmail(newEmail: string) {
  const { data, error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    console.error('Email update error:', error);
    throw error;
  }

  return data;
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error) {
    console.error('Metadata update error:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// AUTH STATE LISTENERS
// ============================================================================

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns true if password meets requirements
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password);

  switch (strength) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Get user-friendly error message
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  const message = error.message || error.error_description || '';

  // Map common Supabase error messages to user-friendly ones
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in';
  }
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('Email rate limit exceeded')) {
    return 'Too many requests. Please try again later';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 8 characters long';
  }
  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address';
  }
  if (message.includes('Token expired')) {
    return 'This link has expired. Please request a new one';
  }
  if (message.includes('Token invalid')) {
    return 'Invalid verification code';
  }

  // Return original message if no mapping found
  return message || 'An error occurred during authentication';
}
