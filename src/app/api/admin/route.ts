"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
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
          ...updates,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setAdminData((prev) => (prev ? { ...prev, ...data } : null));
      toast.success("Profile updated successfully!");
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to update profile");
      throw err;
    }
  };

  // Sync with session data when available
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setAdminData({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "user",
        avatar: session.user.image || undefined, // Use Google image from session
        createdAt: new Date().toISOString(), // Placeholder, replace with actual data if available
        updatedAt: new Date().toISOString(), // Placeholder
      });
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Not authenticated");
    } else {
      fetchAdminData(); // Fallback to API if session isn't ready
    }
  }, [session, status]);

  return {
    adminData,
    isLoading,
    error,
    fetchAdminData,
    updateAdmin,
  };
};