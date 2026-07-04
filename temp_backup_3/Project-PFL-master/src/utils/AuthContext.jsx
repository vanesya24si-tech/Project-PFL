import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext({});
const USER_STORAGE_KEY = "user";
const ROLE_STORAGE_KEY = "userRole";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const syncAuthState = (nextSession, fallbackRole = null) => {
    const currentUser = nextSession?.user ?? null;
    const resolvedRole = currentUser?.user_metadata?.role || fallbackRole || localStorage.getItem(ROLE_STORAGE_KEY) || null;

    setSession(nextSession);
    setUser(currentUser);
    setRole(resolvedRole);

    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      if (resolvedRole) {
        localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      let fallbackRole = session?.user?.user_metadata?.role ?? null;

      if (session?.user && !fallbackRole) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        fallbackRole = profileData?.role ?? null;
      }

      syncAuthState(session, fallbackRole);
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      syncAuthState(nextSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data?.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const resolvedRole = profileData?.role || data.user?.user_metadata?.role || "customer";
      localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
      setRole(resolvedRole);
    }

    return data;
  };

  const register = async (email, password, name, roleValue) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: roleValue }
      }
    });
    if (error) throw error;

    if (data?.user) {
      const resolvedRole = data.user?.user_metadata?.role || roleValue || "customer";
      localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
      setRole(resolvedRole);
    }

    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    syncAuthState(null);
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
