import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { Employee } from "@/app/types/types";

export const useEmployees = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching employees");
      toast.error("Failed to load employee data");
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query.trim()) {
      router.push(`/employee/details?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/employee/details");
    }
  };

  const handleFilter = () => {
    toast.info("Filter functionality will be implemented here");
  };

  const handleEdit = (employee: Employee) => {
    router.push(`/admin/employees/edit/${employee.id}`);
  };

  const handleDelete = async (employee: Employee) => {
    if (
      confirm(
        `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
      )
    ) {
      try {
        const response = await fetch(`/api/employee?id=${employee.id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete employee");

        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete employee");
      }
    }
  };

  const handleView = (employee: Employee) => {
    router.push(`/viewemployeedetail${employee.id}`);
  };

  const filteredEmployees = employees.filter((employee) => {
    if (!searchQuery) return true;

    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      employee.employeeId.toLowerCase().includes(searchLower) ||
      employee.workEmail.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.designation?.toLowerCase().includes(searchLower) ||
      employee.employeeType?.toLowerCase().includes(searchLower) ||
      employee.status?.toLowerCase().includes(searchLower) ||
      employee.mobileNumber?.toLowerCase().includes(searchLower) ||
      employee.address?.toLowerCase().includes(searchLower)
    );
  });

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredEmployees.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  return {
    employees,
    isLoading,
    error,
    currentPage,
    recordsPerPage,
    searchQuery,
    filteredEmployees,
    paginatedData,
    handleSearch,
    handleFilter,
    handleEdit,
    handleDelete,
    handleView,
    setCurrentPage,
    setRecordsPerPage,
  };
};
