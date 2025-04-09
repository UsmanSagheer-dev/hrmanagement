// hooks/useUserData.ts
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { EmployeeData } from "@/app/types/types";
import { toast } from "react-toastify";

export const useUserData = (employeeId?: string) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<EmployeeData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        const msg = "Please sign in to view user data";
        setError(msg);
        setLoading(false);
        toast.error(msg);
        return;
      }

      try {
        setLoading(true);
        const id = employeeId || session?.user?.id;
        if (!id) throw new Error("No user ID available");

        const res = await fetch(`/api/employee?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();

        if (!data) {
          toast.error("No data found for this employee");
          return;
        }

        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          jobTitle: data.designation || "",
          email: data.email || data.workEmail || "",
          profileImage: data.profileImage || null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [employeeId, session, status]);

  return { userData, loading, error };
};
