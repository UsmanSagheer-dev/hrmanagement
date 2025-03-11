"use client";
import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../header/Header";
import Table from "../components/table/Table"; // Your existing Table (we'll replace it with the refactored one)
import Pagination from "../components/pagination/Pagination"; // Import Pagination
import RowActions from "../components/rowActions/RowActions"; // Import RowActions
import Image from "next/image";
import EmployeeTableToolbar from "../components/employeeTableToolbar/EmployeeTableToolbar";

// Define Employee interface (already in your code, just moved up for clarity)
export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  type: string;
  status: string;
  image?: string;
}

function AllEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "000666000",
      name: "Vasilisa",
      department: "PM",
      designation: "Project Manager",
      type: "Office",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
    {
      id: "000666000",
      name: "Dina",
      department: "HR",
      designation: "HR Executive",
      type: "Office",
      status: "Permanent",
      image: "/avatars/dina.jpg",
    },
    {
      id: "000666000",
      name: "Vasilisa",
      department: "Development",
      designation: "React JS Developer",
      type: "Office",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
    {
      id: "000666000",
      name: "Dina",
      department: "Finance",
      designation: "Finance Manager",
      type: "Office",
      status: "Permanent",
      image: "/avatars/dina.jpg",
    },
    {
      id: "000666000",
      name: "Vasilisa",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Office",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
    {
      id: "000666000",
      name: "Dina",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/dina.jpg",
    },
    {
      id: "000666000",
      name: "Vasilisa",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
    {
      id: "000666000",
      name: "Dina",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/dina.jpg",
    },
    {
      id: "000666000",
      name: "Vasilisa",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
    {
      id: "000666000",
      name: "Dina",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/dina.jpg",
    },
    {
      id: "000666000",
      name: "Vasilisa",
      department: "Finance",
      designation: "Finance Analyst",
      type: "Remote",
      status: "Permanent",
      image: "/avatars/vasilisa.jpg",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5); // Adjust as needed

  const handleAddEmployee = () => {
    console.log("Add employee clicked");
  };

  const handleEdit = (employee: Employee) => {
    console.log("Edit:", employee);
  };

  const handleDelete = (employee: Employee) => {
    console.log("Delete:", employee);
  };

  const handleView = (employee: Employee) => {
    console.log("View:", employee);
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
    // Add filtering logic here if needed
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  const actualTotalRecords = employees.length;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = employees.slice(
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
    { key: "id", header: "Employee ID" },
    { key: "department", header: "Department" },
    { key: "designation", header: "Designation" },
    { key: "type", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <span className="text-orange-500 bg-[#E253191A] p-1 rounded-[4px] text-[16px] font-light">
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
              title="All Employees"
              description="All Employee Information"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col">
            {/* Toolbar */}
            <div className="mb-4 flex-shrink-0">
              <EmployeeTableToolbar />
            </div>

            {/* Table Container */}
            <div className="flex-grow overflow-auto hide-vertical-scrollbar">
              <Table data={paginatedData} columns={columns} />
            </div>

            {/* Pagination */}
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

export default AllEmployee;
