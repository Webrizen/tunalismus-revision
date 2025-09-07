"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { user: userData } = await res.json();
          setUser(userData);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded);

    // Redirect based on role to the most relevant page
    switch (decoded.role) {
      case 'admin':
        router.push('/dashboard');
        break;
      case 'trainer':
        router.push('/dashboard/batches'); // "My Batches"
        break;
      case 'student':
        router.push('/dashboard/courses'); // "My Courses"
        break;
      default:
        router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refetchUser: fetchUser, // Expose a way to refetch user data if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
