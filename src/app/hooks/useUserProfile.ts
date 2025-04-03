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
    if (!session?.user?.id) return;

    const cachedData = cache.get(session.user.id);
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
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch user data");

      setUserData(data);
      cache.set(session.user.id, data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching user data");
      console.error("User fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session, initialUserData]);

  const updateUser = useCallback(
    async (updates: { name?: string; role?: string; avatar?: string }) => {
      if (!userData?.id) throw new Error("No user ID available");

      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Update failed");

        console.log("Updated user data from hook:", data); 
        setUserData((prev) => {
          const updated = prev ? { ...prev, ...data } : null;
          if (updated && session?.user?.id) cache.set(session.user.id, updated);
          return updated;
        });
        setError(null);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to update profile");
        throw err;
      }
    },
    [userData, session]
  );

  useEffect(() => {
    if (initialUserData) {
      setUserData(initialUserData);
      if (session?.user?.id) cache.set(session.user.id, initialUserData);
      setIsLoading(false);
      setError(null);
    } else if (status === "authenticated" && session?.user) {
      const sessionData: UserData = {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "user",
        avatar: session.user.image || undefined,
        createdAt: session.user.createdAt || new Date().toISOString(),
        updatedAt: session.user.updatedAt || new Date().toISOString(),
      };
      setUserData(sessionData);
      cache.set(session.user.id, sessionData);
      fetchUserData();
    } else if (status === "unauthenticated") {
      setUserData(null);
      setIsLoading(false);
      setError("Not authenticated");
    }
  }, [session, status, fetchUserData, initialUserData]);

  return { userData, isLoading, error, fetchUserData, updateUser };
};