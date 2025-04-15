"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Employee } from "@/app/types/types";
import toast from "react-hot-toast";

export function useDepartmentEmployees() {
  const router = useRouter();
  const params = useParams();
  const departmentName = decodeURIComponent(params.departmentName as string);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `/api/employee?department=${encodeURIComponent(departmentName)}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const employees = await response.json();

        const mappedEmployees = employees?.map((emp: any) => ({
          id: emp.employeeId,
          name: `${emp?.firstName} ${emp?.lastName}`,
          designation: emp?.designation || "No Designation",
          type: emp?.employeeType || "Office",
          status: emp?.status || "Permanent",
          image: emp?.profileImage || "/avatars/default.jpg",
        }));

        setEmployees(mappedEmployees);
      } catch {
        toast.error("Error fetching employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [departmentName]);

 
  const handleDelete = async (employee: Employee) => {
    try {
      const response = await fetch(`/api/employee?id=${employee.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      setEmployees(employees.filter((emp) => emp.id !== employee.id));
    } catch {
      toast.error("Error deleting employee");
    }
  };

  const handleView = (employee: Employee) => {
    router.push(`/employee/${employee.id}`);
  };

  const actualTotalRecords = employees.length;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = employees.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  return {
    departmentName,
    employees,
    loading,
    currentPage,
    recordsPerPage,
    paginatedData,
    actualTotalRecords,
    setCurrentPage,
    setRecordsPerPage,
    handleDelete,
    handleView,
  };
}
