import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; 
import { toast } from "react-toastify";
import { UserData } from "../../types/types";

const useUserData = (employeeId: string | undefined) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        const url = `/api/employee?id=${id}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const data = await response.json();

        if (!data) {
          toast.error("No data found for this employee");
          setUserData(null);
          return;
        }

        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId, session, status]);

  return { userData, loading, error };
};

export default useUserData;
