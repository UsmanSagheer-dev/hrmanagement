"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAttendance } from "../../hooks/useAttendance";
import { AttendanceStatus } from "@/app/constants/constants";
import { Employee } from "@/app/types/types";

export function useAttendanceManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchAllAttendance, updateAttendance, createAttendance } = useAttendance();

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
          firstName: employee.firstName,
          lastName: employee.lastName,
          designation: employee.designation,
          employeeType: employee.employeeType,
          checkInTime: attendance?.checkInTime || null,
          status: (attendance?.status || "ABSENT") as AttendanceStatus,
          profileImage: employee.profileImage,
        };
      });

      setEmployees(employeesWithAttendance);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching employees");
      toast.error("Failed to load employee data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredEmployees = employees.filter((employee) => {
    if (!searchQuery) return true;

    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      employee.designation.toLowerCase().includes(searchLower) ||
      employee.employeeType.toLowerCase().includes(searchLower)
    );
  });

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredEmployees.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveAttendance = async (data: {
    employeeId: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    status?: AttendanceStatus;
  }) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const existingRecords = await fetchAllAttendance(today);
      const existingRecord = existingRecords.find(
        (record: any) => record.employeeId === data.employeeId
      );

      if (existingRecord) {
        await updateAttendance(existingRecord.id, {
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          status: data.status,
        });
      } else {
        await createAttendance(data.employeeId, {
          date: today,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          status: data.status,
        });
      }
      await fetchEmployees();
    } catch (error) {
      throw new Error("Failed to save attendance");
    }
  };

  return {
    employees,
    isLoading,
    error,
    currentPage,
    recordsPerPage,
    searchQuery,
    selectedEmployee,
    isModalOpen,
    paginatedData,
    filteredEmployees,
    setCurrentPage,
    setRecordsPerPage,
    setIsModalOpen,
    handleSearch,
    handleRowClick,
    handleSaveAttendance,
  };
}