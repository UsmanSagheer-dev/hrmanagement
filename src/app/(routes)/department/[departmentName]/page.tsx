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
import { useDepartmentEmployees } from "@/app/hooks/useDepartmentEmployees";

function ViewDepartment() {
  const {
    departmentName,
    loading,
    paginatedData,
    currentPage,
    recordsPerPage,
    actualTotalRecords,
    setCurrentPage,
    setRecordsPerPage,
    handleEdit,
    handleDelete,
    handleView,
  } = useDepartmentEmployees();

  const columns = [
    { key: "id", header: "Employee ID" },
    {
      key: "name",
      header: "Employee Name",
      render: (employee: Employee) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 mr-2">
            {employee.image ? (
              <Image
                src={employee.image}
                alt={employee.name}
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[16px] font-light">
                {employee.name.charAt(0)}
              </div>
            )}
          </div>
          {employee.name}
        </div>
      ),
    },
    { key: "designation", header: "Designation" },
    { key: "type", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <span className="text-orange-500 bg-[#E253191Acrit p-1 rounded-[4px] text-[16px] font-light">
          {employee.status}
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
              title={`${departmentName} Department`}
              description={`All Departments > ${departmentName} Department`}
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col">
            <div className="mb-4 flex-shrink-0">
              <EmployeeTableToolbar />
            </div>
            <div className="flex-grow overflow-auto hide-vertical-scrollbar">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : (
                <Table data={paginatedData} columns={columns} />
              )}
            </div>
            <div className="mt-4 flex-shrink-0">
              <Pagination
                currentPage={currentPage}
                recordsPerPage={recordsPerPage}
                totalRecords={actualTotalRecords}
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

export default ViewDepartment;