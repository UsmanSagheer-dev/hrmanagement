"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Monitor session status changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Redirect based on role when session is available
      if (session.user.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee/add");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Force session update after successful login
        await update();
        
        // Note: The useEffect above will handle redirection once session is updated
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signIn("google", { redirect: false });
      // Force session update
      await update();
      // Redirection handled by useEffect
    } catch (err) {
      setError("Failed to login with Google");
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleGoogleLogin,
    session,
    sessionStatus: status
  };
}