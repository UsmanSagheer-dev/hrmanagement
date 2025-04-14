import React from "react";
import { MdArrowForwardIos } from "react-icons/md";
import Button from "../button/Button";
import { DepartmentListProps } from "@/app/types/types";


const DepartmentList: React.FC<DepartmentListProps> = ({
  departmentName,
  members,
  totalMembers,
  onViewAll,
}) => {
  return (
    <div className="bg-transparent h-[380px] text-white rounded-lg p-4 shadow-lg border border-[#A2A1A833] overflow-y-scroll scrollbar-hide">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{departmentName}</h2>
          <p className="text-[#A2A1A8] text-sm font-light">
            {totalMembers} Members
          </p>
        </div>
        <Button
          title="View All"
          onClick={onViewAll}
          className="text-orange-500 hover:text-orange-400 text-sm font-medium"
        />
      </div>
      <div className="w-full bg-[#A2A1A833] h-[2px] mb-[20px]"></div>
      <ul className="space-y-3">
        {members.map((member) => (
          <li key={member.id} className="flex items-center space-x-4">
            <img
              src={member.imageUrl}
              alt={`${member.name}'s profile`}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/default-profile.jpg"; 
              }}
            />
            <div>
              <p className="text-white font-light">{member.name}</p>
              <p className="text-[#A2A1A8] font-light text-[12px]">
                {member.title}
              </p>
            </div>
            <span className="ml-auto text-white">
              <MdArrowForwardIos />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;