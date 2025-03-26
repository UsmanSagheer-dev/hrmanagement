"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        const userRole = await fetchUserRole();
        if (userRole === "Admin") {
          router.push("/dashboard");
        } else {
          router.push("/employee/add");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      const userRole = await fetchUserRole();
      if (userRole === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/employee/add");
      }
    } catch (err) {
      setError("Failed to initiate Google login.");
      setLoading(false);
    }
  };

  const fetchUserRole = async (): Promise<string> => {
    try {
      const response = await fetch("/api/user/role", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.role;
    } catch (err) {
      console.error("Error fetching user role:", err);
      return "user";
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
  };
}
