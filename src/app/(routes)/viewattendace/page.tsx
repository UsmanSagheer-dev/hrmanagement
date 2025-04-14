"use client";
import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import Image from "next/image";
import SearchBar from "../../components/searchBar/SearchBar";
import AttendanceModal from "@/app/components/attendanceModal/AttendanceModal";
import { Employee } from "@/app/types/types";
import { useAttendanceManagement } from "./useAttendanceManagement";

function ViewAttendance() {
  const {
    isLoading,
    error,
    currentPage,
    recordsPerPage,
    paginatedData,
    filteredEmployees,
    selectedEmployee,
    isModalOpen,
    setCurrentPage,
    setRecordsPerPage,
    setIsModalOpen,
    handleSearch,
    handleRowClick,
    handleSaveAttendance,
  } = useAttendanceManagement();

  const columns = [
    {
      key: "name",
      header: "Employee Name",
      render: (employee: Employee) => (
        <div
          className="flex items-center cursor-pointer hover:bg-[#2A3435] p-2 rounded"
          onClick={() => handleRowClick(employee)}
        >
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
    { key: "designation", header: "Designation" },
    { key: "employeeType", header: "Type" },
    {
      key: "checkInTime",
      header: "Check In Time",
      render: (employee: Employee) => employee.checkInTime || "--",
    },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <span
          className={`p-1 rounded-[4px] text-[16px] font-light ${
            employee.status === "ON_TIME"
              ? "text-green-500 bg-green-500/10"
              : employee.status === "LATE"
              ? "text-red-500 bg-red-500/10"
              : "text-gray-500 bg-gray-500/10"
          }`}
        >
          {employee.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col items-center gap-[30px]">
          <div className="w-full">
            <Header
              title="Attendance"
              description="All Employee Attendance"
              textColor="#A2A1A8"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col">
            <div className="mb-7 flex-shrink-0">
              <SearchBar onSearch={handleSearch} />
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
                  No attendance records found
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
      {isModalOpen && selectedEmployee && (
        <AttendanceModal
          employee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAttendance}
        />
      )}
    </div>
  );
}

export default ViewAttendance;
