"use client";
import React from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/header/Header";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/pagination/Pagination";
import RowActions from "../../../components/rowActions/RowActions";
import Image from "next/image";
import EmployeeTableToolbar from "../../../components/employeeTableToolbar/EmployeeTableToolbar";
import { Employee } from "@/app/types/types";
import { useEmployees } from "./useEmployees";
import toast from "react-hot-toast";

function Page() {
  const {
    isLoading,
    error,
    currentPage,
    recordsPerPage,
    filteredEmployees,
    paginatedData,
    handleSearch,
    handleFilter,
    handleEdit,
    handleDelete,
    handleView,
    setCurrentPage,
    setRecordsPerPage,
  } = useEmployees();

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
                onError={() => toast.error("Image failed to load")}
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
    <div className="h-screen bg-[#131313] p-[15px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">
          <Header
            title="All Employees"
            description="All Employee Information"
          />

          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-3 flex flex-col">
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
                onPageChange={setCurrentPage}
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
