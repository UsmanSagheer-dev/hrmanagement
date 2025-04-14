"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

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
        const updatedSession = await update();

        if (updatedSession?.user?.role === "Admin") {
          router.push("/dashboard");
        } else {
          router.push("/employee/add");
        }
      }
    } catch {
      toast.error("Login failed. Please try again.");
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const updatedSession = await update();

      if (updatedSession?.user?.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee/add");
      }
    } catch (err) {
      toast.error("Google login failed");
      setError("Failed to login with Google");
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
    handleGoogleLogin,
    session,
    sessionStatus: status,
  };
}
