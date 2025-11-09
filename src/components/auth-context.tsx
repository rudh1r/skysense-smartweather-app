import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import {
  signInWithEmail as supabaseSignIn,
  signUpWithEmail as supabaseSignUp,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOut as supabaseSignOut,
  sendPasswordResetEmail,
  updatePassword,
  isValidEmail,
} from '@/lib/auth-helpers';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  validateEmail: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Handle initial session check
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
        });
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoading(true);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const onboardingComplete = localStorage.getItem('skysense_onboarding');
    if (onboardingComplete) {
      setHasCompletedOnboarding(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    return isValidEmail(email);
  };

  const signIn = async (email: string, password: string) => {
    return await supabaseSignIn(email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    return await supabaseSignUp(email, password, name);
  };

  const signInWithGoogle = async () => {
    await supabaseSignInWithGoogle();
  };

  const signOut = () => {
    supabaseSignOut();
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('skysense_onboarding', 'true');
  };

  const resetPassword = async (email: string) => {
    // This function now only sends the reset email.
    // The password update will happen on a dedicated page after the user clicks the link.
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address.");
    }
    await sendPasswordResetEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        hasCompletedOnboarding,
        completeOnboarding,
        resetPassword,
        validateEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}