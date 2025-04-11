"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../header/Header";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/pagination/Pagination";
import RowActions from "../../../components/rowActions/RowActions";
import Image from "next/image";
import EmployeeTableToolbar from "../../../components/employeeTableToolbar/EmployeeTableToolbar";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Employee } from "@/app/types/types";



function Page() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
      setTotalRecords(data.length);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching employees");
      toast.error("Failed to load employee data");
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

        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }

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
      employee.department.toLowerCase().includes(searchLower)
    );
  });

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredEmployees.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const columns = [
    {
      key: "name",
      header: "Employee Name",
      render: (employee: Employee) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 mr-2">
            {employee.profileImage ? (
              <Image
                src={employee.profileImage}
                alt={`${employee.firstName} ${employee.lastName}`}
                width={32}
                height={32}
                className="object-cover"
                onError={() => console.error("Image failed to load")}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[16px] font-light">
                {employee.firstName.charAt(0)}
              </div>
            )}
          </div>
          {`${employee.firstName} ${employee.lastName}`}
        </div>
      ),
    },
    { key: "employeeId", header: "Employee ID" },
    { key: "department", header: "Department" },
    { key: "designation", header: "Designation" },
    { key: "employeeType", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <span className="text-orange-500 bg-[#E253191A] p-1 rounded-[4px] text-[16px] font-light">
          {employee.status || "Permanent"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (employee: Employee) => (
        <RowActions
          onView={() => handleView(employee)}
          onEdit={() => handleEdit(employee)}
          onDelete={() => handleDelete(employee)}
        />
      ),
    },
  ];

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="w-full">
            <Header
              title="All Employees"
              description="All Employee Information"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col">
            <div className="mb-4 flex-shrink-0">
              <EmployeeTableToolbar
                onSearch={handleSearch}
                onFilter={handleFilter}
              />
            </div>

            <div className="flex-grow overflow-auto hide-vertical-scrollbar">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
              ) : paginatedData.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  No employees found
                </div>
              ) : (
                <Table data={paginatedData} columns={columns} />
              )}
            </div>

            <div className="mt-4 flex-shrink-0">
              <Pagination
                currentPage={currentPage}
                recordsPerPage={recordsPerPage}
                totalRecords={filteredEmployees.length}
                onPageChange={(page) => setCurrentPage(page)}
                onRecordsPerPageChange={(newRecords) => {
                  setRecordsPerPage(newRecords);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
