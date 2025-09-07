"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Loader2 } from 'lucide-react';

export default function RouteGuard({ children, allowedRoles = [] }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) {
      return; // Wait for the auth state to be determined
    }

    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(auth.user.role)) {
      // User is authenticated but doesn't have the right role
      // Redirect to their own dashboard or a generic unauthorized page
      switch (auth.user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'trainer':
          router.push('/trainer/dashboard');
          break;
        case 'student':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/'); // Or a dedicated /unauthorized page
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, allowedRoles, router]);

  // While loading, show a full-screen loader
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If authenticated and authorized, render the children
  if (auth.isAuthenticated && (allowedRoles.length === 0 || allowedRoles.includes(auth.user?.role))) {
    return children;
  }

  // If not authenticated, the useEffect will have already started the redirect.
  // We can show a loader while the redirect happens.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}