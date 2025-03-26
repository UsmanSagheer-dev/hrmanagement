"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export const useAdmin = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch admin");
      
      setAdminData(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Admin fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdmin = async (updates: {
    name?: string;
    role?: string;
    avatar?: string;
  }) => {
    try {
      if (!adminData?.id) throw new Error("No user ID available");
      
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: adminData.id,
          ...updates
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setAdminData(prev => prev ? { ...prev, ...data } : null);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    adminData,
    isLoading,
    error,
    fetchAdminData,
    updateAdmin,
  };
};