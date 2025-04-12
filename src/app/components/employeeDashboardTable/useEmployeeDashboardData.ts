import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Employee } from "@/app/types/types";
import { useAttendance } from "../../hooks/useAttendance";
import { AttendanceStatus } from "@/app/constants/constants";

export const useEmployeeDashboardData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchAllAttendance } = useAttendance();

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split("T")[0];
        const attendanceData = await fetchAllAttendance(today);

        const employeeResponse = await fetch("/api/employee");
        if (!employeeResponse.ok) {
          throw new Error("Failed to fetch employees");
        }
        const employeeData = await employeeResponse.json();

        const employeesWithAttendance = employeeData.map((employee: any) => {
          const attendance = attendanceData.find(
            (record: any) => record.employeeId === employee.id
          );
          return {
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            designation: employee.designation,
            type: employee.employeeType,
            checkInTime: attendance?.checkInTime || "--",
            status: (attendance?.status || "ABSENT") as AttendanceStatus,
            avatar: employee.profileImage,
          };
        });

        setEmployees(employeesWithAttendance);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching employees");
        toast.error("Failed to load employee data");
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [fetchAllAttendance]);

  return { employees, isLoading, error };
};
