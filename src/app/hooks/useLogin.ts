"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!email || !password) {
    const errorMsg = "Email and password are required";
    setError(errorMsg);
    toast.error(errorMsg); 
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
      toast.error("Invalid credentials");
      setLoading(false);
      return;
    }

    if (result?.ok) {
      const updatedSession = await update();

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
    toast.error("Login failed. Please try again.");
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