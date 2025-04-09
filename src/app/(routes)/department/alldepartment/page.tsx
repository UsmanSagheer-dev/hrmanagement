"use client";
import React, { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../header/Header";
import DepartmentList from "../../../components/departmentList/DepartmentList";
import SearchBar from "../../../components/searchBar/SearchBar";
import { useRouter } from "next/navigation";

interface Member {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
}
export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  type: string;
  status: string;
  image?: string;
}

interface DepartmentListProps {
  departmentName: string;
  members: Member[];
  totalMembers: number;
  onViewAll?: () => void;
}

function AllDepartment() {
  const router = useRouter();
  const [departments] = useState([
    {
      name: "Engineering",
      members: [
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
      ],
      totalMembers: 15,
    },
    {
      name: "Engineering",
      members: [
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
      ],
      totalMembers: 15,
    },
    {
      name: "Engineering",
      members: [
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
        {
          id: 1,
          name: "John Doe",
          title: "Senior Developer",
          imageUrl: "/images/john-doe.jpg",
        },
        {
          id: 2,
          name: "Jane Smith",
          title: "Frontend Developer",
          imageUrl: "/images/jane-smith.jpg",
        },
      ],
      totalMembers: 15,
    },
    {
      name: "Design",
      members: [
        {
          id: 3,
          name: "Mike Johnson",
          title: "UI/UX Designer",
          imageUrl: "/images/mike-johnson.jpg",
        },
      ],
      totalMembers: 8,
    },
  ]);

  const handleViewAll = (departmentName: string) => {
    router.push(`/department${departmentName.toLowerCase()}`);
  };

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full  flex flex-col justify-center gap-[30px]">
          <div className="w-full">
            <Header
              title="Design Department"
              description="All Departments > Design Department"
              textColor="#ffffff"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
            <div className="mb-[30px]">
              <SearchBar />
            </div>
            <div className="w-full grid  md:grid-cols-2 grid-cols-1 gap-[20px] ">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllDepartment;
