"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const useAdmin = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin data
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
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update admin data
  const updateAdmin = async (updates: { name?: string; email?: string; password?: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update admin");

      setAdminData(data);
      toast.success("Admin updated successfully");
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin
  const deleteAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete admin");

      setAdminData(null);
      toast.success("Admin deleted successfully");
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
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
    deleteAdmin,
  };
};