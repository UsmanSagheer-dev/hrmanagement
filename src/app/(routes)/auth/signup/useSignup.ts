"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  user: string;
  email: string;
  password: string;
  error:any
  
}

export const useSignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    user: "",
    email: "",
    password: "",
    error: null,
  });

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = formData;

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setIsLoading(true);

    // Log the data being sent
    console.log("Sending to API:", { email, password });
    const body = JSON.stringify({ email, password });
    console.log("Serialized body:", body);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    toast.success("Account created successfully!");
    router.push("/dashboard");
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  const navigateToLogin = () => {
    router.push("/login");
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    navigateToLogin,
  };
};