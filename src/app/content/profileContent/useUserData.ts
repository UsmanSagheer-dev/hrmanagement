import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { UserData } from "../../types/types";

interface UseUserDataOptions {
  skipFetch?: boolean;
}

const useUserData = (
  employeeId: string | undefined,
  options: UseUserDataOptions = {}
) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If skipFetch is true, don't make API call (for mock data usage)
    if (options.skipFetch) {
      setLoading(false);
      return;
    }

    const fetchEmployeeData = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        setError("Please sign in to view employee data");
        setLoading(false);
        toast.error("Please sign in to view employee data");
        return;
      }

      try {
        setLoading(true);
        const id = employeeId || session?.user?.id;
        if (!id) {
          throw new Error("No user ID available");
        }

        const url = `/api/employee?id=${encodeURIComponent(id)}`;
        
        // Log outgoing request for debugging
        console.debug("Fetching employee data:", { id, url });

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          let errMsg = `Request failed with status ${response.status}`;
          try {
            const errJson = await response.json();
            if (errJson?.error) errMsg = errJson.error;
          } catch (e) {
            // Ignore JSON parse errors
          }
          throw new Error(errMsg);
        }

        const data = await response.json();

        console.debug("Employee data received:", data);

        if (!data || (Array.isArray(data) && data.length === 0)) {
          const serverMsg =
            data && typeof data === "object" && "error" in data
              ? (data as any).error
              : null;
          const errorMessage = serverMsg || "No data found for this employee";
          setError(errorMessage);
          toast.error(errorMessage);
          setUserData(null);
          return;
        }

        setUserData(data as UserData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId, session, status, options.skipFetch]);

  return { userData, loading, error, setUserData };
};

export default useUserData;