"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  error: any;
}

export const useSignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    error: null,
  });

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = formData;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      const body = JSON.stringify({ name, email, password });

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

      if (data.role === "Admin") {
        toast.success("Admin account created successfully!");
        router.push("/auth/login");
      } else {
        toast.success("Employee account created successfully!");
        router.push("/auth/login");
      }

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    navigateToLogin,
  };
};