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
        // Force session update
        const updatedSession = await update();
        
        // Wait for session to be available
        const checkSession = async () => {
          if (status === "authenticated" && updatedSession?.user) {
            if (updatedSession.user.role === "Admin") {
              router.push("/dashboard");
            } else {
              router.push("/employee/add");
            }
          } else {
            setTimeout(checkSession, 500);
          }
        };

        await checkSession();
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
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
    session,
    sessionStatus: status,
  };
}