"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RouteGuard({
  children,
  allowedRoles = [],
  redirectPath = "/login",
  loadingComponent,
  fallbackComponent,
  onAuthSuccess
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [redirectReason, setRedirectReason] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const timerRef = useRef(null);
  const hasVerifiedRef = useRef(false); // Add ref to track if verification has already run

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push(redirectPath);
    }
  }, [countdown, router, redirectPath]);

  // Countdown timer for redirect - using useCallback to prevent recreation
  const startCountdown = useCallback(() => {
    console.log("Starting countdown");
    setIsLoading(false);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          console.log("Countdown finished");
          clearInterval(timerRef.current);
          return 0;
        }
        console.log("Countdown:", prev - 1);
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Skip if already verified
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verifyAuth = async () => {
      // Check if we're on the client side
      if (typeof window === "undefined") return;

      try {
        const token = localStorage.getItem("token");
        console.log("Token found:", token ? "Yes" : "No");

        // No token found, redirect to login
        if (!token) {
          console.log("No token found, starting countdown");
          setRedirectReason("No authentication token found");
          setShowCountdown(true);
          startCountdown();
          return;
        }

        // Show verifying state
        setIsLoading(true);
        console.log("Verifying token with API");

        // Verify token with backend
        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response status:", res.status);

        if (res.ok) {
          const { user } = await res.json();
          console.log("User data received:", user);
          setUser(user);

          // Notify parent component about successful auth
          if (onAuthSuccess) {
            onAuthSuccess(user);
          }

          // Check if user has required role
          if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
            console.log("User authorized, role:", user.role);
            setIsAuthorized(true);
            setIsLoading(false);
          } else {
            // User doesn't have required role
            console.log("User not authorized, role:", user.role, "allowed:", allowedRoles);
            setRedirectReason(`Your account (${user.role}) doesn't have access to this page`);
            setIsAuthorized(false);
            setShowCountdown(true);
            startCountdown();
          }
        } else {
          // Token is invalid, remove it and redirect
          console.log("Token invalid, removing from storage");
          localStorage.removeItem("token");
          setRedirectReason("Your session has expired or is invalid");
          setShowCountdown(true);
          startCountdown();
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        setRedirectReason("An authentication error occurred");
        setShowCountdown(true);
        startCountdown();
      }
    };

    verifyAuth();
  }, [router, redirectPath, allowedRoles, pathname, onAuthSuccess, startCountdown]);

  // Show loading state (only for initial verification, not for countdown)
  if (isLoading) {
    console.log("Showing loading state");
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                Verifying...
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Checking your access</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please wait while we verify your permissions
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized access message with countdown
  if (!isAuthorized && showCountdown) {
    console.log("Showing unauthorized state with countdown:", countdown);
    return fallbackComponent || (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="flex flex-col items-center space-y-6 max-w-md p-6 text-center border rounded-lg shadow-lg bg-card">
          <div className="flex flex-col items-center space-y-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              {redirectReason || "You don't have permission to access this page."}
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact an administrator if you believe this is an error.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Redirecting in {countdown} seconds...</span>
            </div>

            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(5 - countdown) * 20}%` }}
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => {
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                  }
                  router.push(redirectPath);
                }}
                variant="default"
              >
                Go Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content
  console.log("Rendering protected content");
  return children;
}