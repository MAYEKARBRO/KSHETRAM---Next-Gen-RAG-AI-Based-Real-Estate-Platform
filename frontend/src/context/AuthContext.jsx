import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseLive } from '../lib/supabaseClient';
import { eraseUserAccount } from '../lib/api';

const AuthContext = createContext();

// Check if an auth session token exists in localStorage (synchronous 0ms check)
function hasStoredSession() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('auth-token') || key === 'kshetram_user')) {
        const item = localStorage.getItem(key);
        if (item && item.length > 20) return true;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Only show initial verification if there's actually a stored session to restore
  const [initialLoading, setInitialLoading] = useState(() => hasStoredSession());
  // Form submission loading state (used by AuthPage login/signup buttons)
  const [loading, setLoading] = useState(false);

  // Sync profile details from Supabase profiles table with fast timeout fallback
  const fetchUserProfile = async (authUser) => {
    if (!authUser) return null;
    const meta = authUser.user_metadata || {};

    const baseProfile = {
      id: authUser.id,
      email: authUser.email,
      first_name: meta.first_name || authUser.email?.split('@')[0] || 'User',
      last_name: meta.last_name || '',
      phone: meta.phone || '',
      role: meta.role || 'buyer',
      company_name: meta.company_name || '',
      company_logo_url: meta.company_logo_url || '',
      isLoggedIn: true
    };

    try {
      if (!isSupabaseLive) return baseProfile;

      // Query profiles table with a strict 1s timeout to prevent hanging on cold starts
      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile query timeout')), 1000)
      );

      const { data: profile } = await Promise.race([queryPromise, timeoutPromise]);

      if (profile) {
        return {
          ...baseProfile,
          first_name: profile.first_name || baseProfile.first_name,
          last_name: profile.last_name || baseProfile.last_name,
          phone: profile.phone || baseProfile.phone,
          role: profile.role || baseProfile.role,
          company_name: profile.company_name || baseProfile.company_name,
          company_logo_url: profile.company_logo_url || baseProfile.company_logo_url
        };
      }
    } catch (err) {
      console.warn('Fast fallback profile used:', err.message);
    }

    return baseProfile;
  };

  // Initial session check on mount
  useEffect(() => {
    let mounted = true;

    // Hard fallback timer: NEVER block user on loading screen for more than 1.2s under any circumstances
    const safetyTimer = setTimeout(() => {
      if (mounted) setInitialLoading(false);
    }, 1200);

    async function initSession() {
      try {
        // If no stored token or Supabase not live, skip immediately to AuthPage landing
        if (!isSupabaseLive || !hasStoredSession()) {
          if (mounted) {
            setUser(null);
            setInitialLoading(false);
          }
          return;
        }

        // Fast session check with 1s timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session verify timeout')), 1000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        const session = result?.data?.session;

        if (session?.user && mounted) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else if (mounted) {
          setUser(null);
        }
      } catch (err) {
        console.warn('Fast session init fallback:', err.message);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    }

    initSession();

    // Listen to Supabase Auth state changes
    let subscription = null;
    if (isSupabaseLive) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        if (mounted) setInitialLoading(false);
      });
      subscription = data?.subscription;
    }

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const skipVerification = () => {
    setInitialLoading(false);
  };

  // Supabase Live Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (!isSupabaseLive) {
        throw new Error('Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;

      if (data?.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        return { success: true, user: userProfile };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Supabase Live Sign Up
  const signup = async ({ firstName, lastName, email, password, phone, role, companyName, companyLogoUrl }) => {
    setLoading(true);
    try {
      if (!isSupabaseLive) {
        throw new Error('Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName?.trim() || '',
            phone: phone.trim(),
            role: role || 'buyer',
            company_name: companyName?.trim() || '',
            company_logo_url: companyLogoUrl?.trim() || ''
          }
        }
      });

      if (error) throw error;

      // If user already exists in Supabase
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please switch to Sign In.'
        };
      }

      // Explicitly sync profile directly into public.profiles
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName?.trim() || '',
            phone: phone.trim(),
            role: role || 'buyer',
            company_name: companyName?.trim() || '',
            company_logo_url: companyLogoUrl?.trim() || ''
          });
        } catch (pErr) {
          console.warn('Direct profile upsert error (handled):', pErr.message);
        }
      }

      // If Supabase returned an active session immediately
      if (data?.session && data?.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        return { success: true, sessionActive: true, user: userProfile };
      }

      // If email confirmation is required by Supabase project settings
      return { 
        success: true, 
        sessionActive: false, 
        needsEmailConfirmation: true,
        message: 'Account registered in Supabase! Please check your email to confirm your address before signing in, or turn off "Confirm email" in Supabase Dashboard (Authentication > Providers > Email) for instant login.' 
      };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out from Supabase
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseLive) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('kshetram_user');
      setLoading(false);
    }
  };

  // Right to be forgotten (Complete User Account & Data Erasure)
  const eraseAccountCompletely = async () => {
    if (!user) return { success: false };
    setLoading(true);
    try {
      await eraseUserAccount(user.id);
      if (isSupabaseLive) {
        await supabase.auth.signOut();
      }
      setUser(null);
      localStorage.removeItem('kshetram_user');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch persona role in UI and update Supabase profiles table
  const switchRole = async (newRole) => {
    if (!user) return;
    setUser(prev => ({ ...prev, role: newRole }));

    if (isSupabaseLive && user.id) {
      try {
        await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Error updating role in Supabase:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      initialLoading,
      skipVerification,
      login,
      signup,
      logout,
      eraseAccountCompletely,
      switchRole,
      isSupabaseLive
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
