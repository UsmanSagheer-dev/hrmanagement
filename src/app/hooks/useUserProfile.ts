"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { UserData } from "../types/types";

const cache = new Map<string, UserData>();

export const useUserProfile = (initialUserData?: UserData | null) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUserData);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (status !== "authenticated") return;

    if (!session?.user?.id) {
      setError("No user ID found in session");
      toast.error("No user ID found in session");
      setIsLoading(false);
      return;
    }

    const userId = session.user.id;

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
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
      cache.set(userId, data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || "An error occurred while fetching user data";
      setError(msg);
      toast.error(msg);
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
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Update failed");
        }

        setUserData((prev) => {
          const updated = prev ? { ...prev, ...data } : data;
          const userId = session.user?.id;
          if (userId) cache.set(userId, updated);
          return updated;
        });

        setError(null);
        toast.success("Profile updated successfully");
        return data;
      } catch (err: any) {
        const msg = err.message || "Failed to update profile";
        setError(msg);
        toast.error(msg);
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
      const msg = "Not authenticated";
      setError(msg);
    }
  }, [status, fetchUserData, initialUserData, session]);

  return { userData, isLoading, error, fetchUserData, updateUser };
};
