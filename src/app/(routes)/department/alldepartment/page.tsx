"use client";
import React from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/header/Header";
import DepartmentList from "../../../components/departmentList/DepartmentList";
import SearchBar from "../../../components/searchBar/SearchBar";
import Loader from "@/app/components/loader/Loader";
import { useDepartments } from "./useDepartments";

function AllDepartment() {
  const { departments, loading, handleViewAll } = useDepartments();

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col  gap-[30px]">
          <div className="w-full">
            <Header
              title="All Departments"
              description="View all departments and their members"
              textColor="#ffffff"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
            <div className="mb-[30px]">
              <SearchBar />
            </div>
            {loading ? (
              <Loader />
            ) : (
              <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-[20px]">
                {departments.map((dept) => (
                  <DepartmentList
                    key={dept.name}
                    departmentName={dept.name}
                    members={dept.members}
                    totalMembers={dept.totalMembers}
                    onViewAll={() => handleViewAll(dept.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllDepartment;
