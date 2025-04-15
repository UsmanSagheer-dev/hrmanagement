import { Notification } from "@/app/types/types";
import { useState, useEffect } from "react";


export const useNotificationEmployee = (notification: Notification) => {
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (notification.type === "EMPLOYEE_REQUEST" && notification.sourceId) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/pendingemployee?id=${notification.sourceId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch employee details");
          }

          const data = await response.json();
          setEmployeeDetails(data);
        } catch (err: any) {
          setError(err.message || "Failed to load employee details");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEmployeeDetails();
  }, [notification]);

  return { employeeDetails, isLoading, error };
};
