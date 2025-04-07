"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

const cache = new Map<string, UserData>();

export const useUserProfile = (initialUserData?: UserData | null) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUserData);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (status !== "authenticated") return;

    if (!session?.user?.id) {
      console.error("No user ID found in session:", session);
      setError("No user ID found in session");
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;
    
    console.log("Fetching user data for ID:", userId);

    const cachedData = cache.get(userId);
    if (cachedData && !initialUserData) {
      setUserData(cachedData);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched user data:", data);
      
      setUserData(data);
      cache.set(userId, data);
      setError(null);
    } catch (err: any) {
      console.error("User fetch error:", err);
      setError(err.message || "An error occurred while fetching user data");
    } finally {
      setIsLoading(false);
    }
  }, [session, status, initialUserData]);

  const updateUser = useCallback(
    async (updates: { name?: string; role?: string; avatar?: string }) => {
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      try {
        console.log("Updating user with data:", updates);
        
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Update error response:", data);
          throw new Error(data.error || "Update failed");
        }

        console.log("Updated user data:", data);
        
        setUserData((prev) => {
          const updated = prev ? { ...prev, ...data } : data;
          const userId = session.user?.id;
          if (userId) cache.set(userId, updated);
          return updated;
        });
        
        setError(null);
        return data;
      } catch (err: any) {
        console.error("Profile update error:", err);
        setError(err.message || "Failed to update profile");
        throw err;
      }
    },
    [session]
  );

  useEffect(() => {
    if (initialUserData) {
      setUserData(initialUserData);
      if (session?.user?.id) cache.set(session.user.id, initialUserData);
      setIsLoading(false);
      setError(null);
    } else if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      setUserData(null);
      setIsLoading(false);
      setError("Not authenticated");
    }
  }, [status, fetchUserData, initialUserData, session]);

  return { userData, isLoading, error, fetchUserData, updateUser };
};