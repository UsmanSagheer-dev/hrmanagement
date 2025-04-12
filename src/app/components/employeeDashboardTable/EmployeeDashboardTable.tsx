"use client";
import React from "react";
import Table from "../table/Table";
import Image from "next/image";
import { Employee } from "@/app/types/types";
import { useEmployeeDashboardData } from "./useEmployeeDashboardData";

const EmployeeDashboardTable: React.FC = () => {
  const { employees, isLoading, error } = useEmployeeDashboardData();

  const columns = [
    {
      key: "name",
      header: "Employee Name",
      render: (item: Employee) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
            {item.avatar ? (
              <Image
                src={item.avatar}
                alt={item.name}
                width={32}
                height={32}
                className="object-cover"
                onError={() => console.error("Image failed to load")}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[16px] font-light">
                {item.name.charAt(0)}
              </div>
            )}
          </div>
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      key: "designation",
      header: "Designation",
    },
    {
      key: "type",
      header: "Type",
    },
    {
      key: "checkInTime",
      header: "Check In Time",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Employee) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.status === "ON_TIME"
              ? "bg-green-500/20 text-green-400"
              : item.status === "LATE"
              ? "bg-red-500/20 text-red-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {item.status.replace("_", " ")}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Employee Overview</h1>
        <select className="bg-gray-900 text-white border border-gray-800 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-700">
          <option>View All</option>
        </select>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No employee records found
        </div>
      ) : (
        <Table data={employees} columns={columns} />
      )}
    </div>
  );
};

export default EmployeeDashboardTable;
