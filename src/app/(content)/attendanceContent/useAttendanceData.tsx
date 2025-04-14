import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "ON_TIME" | "LATE" | "ABSENT";
  employee?: {
    firstName: string;
    lastName: string;
    employeeId: string;
    employeeType: string;
    designation: string;
    profileImage: string | null;
  };
}

const useAttendanceData = (employeeId?: string) => {
  const { data: session, status } = useSession();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        setError("Please sign in to view attendance data");
        setLoading(false);
        toast.error("Please sign in to view attendance data");
        return;
      }

      try {
        setLoading(true);
        const id = employeeId || session?.user?.id;
        if (!id) {
          throw new Error("No user ID available");
        }

        const url = `/api/attendance${employeeId ? `?employeeId=${id}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data: AttendanceRecord[] = await response.json();

        if (!data || data.length === 0) {
          toast.info("No attendance data found");
          setAttendanceData([]);
          return;
        }

        setAttendanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [employeeId, session, status]);

  return { attendanceData, loading, error };
};

export default useAttendanceData;
