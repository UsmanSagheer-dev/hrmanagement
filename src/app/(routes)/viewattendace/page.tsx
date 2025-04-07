"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../header/Header";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import Image from "next/image";
import SearchBar from "../../components/searchBar/SearchBar";

export interface Employee {
  name: string;
  designation: string;
  type: string;
  checkInTime: string;
  status: "On Time" | "Late";
  image?: string;
}

function ViewAttendace() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      name: "Vasilisa Coneva",
      designation: "Team Lead - Design",
      type: "Office",
      checkInTime: "09:27 AM",
      status: "On Time",
      image: "/avatars/vasilisa.jpg",
    },
    {
      name: "Evghenii Conev",
      designation: "Web Designer",
      type: "Office",
      checkInTime: "10:15 AM",
      status: "Late",
      image: "/avatars/evghenii.jpg",
    },
    {
      name: "Jack Conev",
      designation: "Medical Assistant",
      type: "Remote",
      checkInTime: "10:24 AM",
      status: "Late",
      image: "/avatars/jack.jpg",
    },
    {
      name: "Vasilisa Coneva",
      designation: "Marketing Coordinator",
      type: "Office",
      checkInTime: "09:10 AM",
      status: "On Time",
      image: "/avatars/vasilisa.jpg",
    },
    {
      name: "Jack Conev",
      designation: "Data Analyst",
      type: "Office",
      checkInTime: "09:15 AM",
      status: "On Time",
      image: "/avatars/jack.jpg",
    },
    {
      name: "Evghenii Conev",
      designation: "Phyton Developer",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      image: "/avatars/evghenii.jpg",
    },
    {
      name: "Dina Coneva",
      designation: "UI/UX Design",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      image: "/avatars/dina.jpg",
    },
    {
      name: "Vasilisa Coneva",
      designation: "React JS",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      image: "/avatars/vasilisa.jpg",
    },
    {
      name: "Vasilisa C",
      designation: "iOS Developer",
      type: "Remote",
      checkInTime: "10:50 AM",
      status: "Late",
      image: "/avatars/vasilisa_c.jpg",
    },
    {
      name: "Evghenii C",
      designation: "HR",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      image: "/avatars/evghenii_c.jpg",
    },
    {
      name: "Jack C",
      designation: "Sales Manager",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      image: "/avatars/jack_c.jpg",
    },
    {
      name: "Dina Coneva",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      image: "/avatars/dina.jpg",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

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
    { key: "designation", header: "Designation" },
    { key: "type", header: "Type" },
    { key: "checkInTime", header: "Check In Time" },
    {
      key: "status",
      header: "Status",
      render: (employee: Employee) => (
        <span
          className={`p-1 rounded-[4px] text-[16px] font-light ${
            employee.status === "On Time"
              ? "text-green-500 bg-green-500/10"
              : "text-red-500 bg-red-500/10"
          }`}
        >
          {employee.status}
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
              <SearchBar />
            </div>

            <div className="flex-grow overflow-auto hide-vertical-scrollbar">
              <Table data={paginatedData} columns={columns} />
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

export default ViewAttendace;
