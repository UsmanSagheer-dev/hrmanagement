"use client";
import React from "react";
import { HiOutlineBriefcase, HiOutlineMail } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Button from "../button/Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserInfoSectionProps } from "@/app/types/types";
import { useUserData } from "./useUserData";

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
employeeId,
  handleEditProfile,
}) => {
  const { userData: fetchedUserData, loading, error } = useUserData(employeeId);

  if (loading) return <div className="text-white">Loading user data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="flex items-center mt-[20px] border-b border-[#A2A1A833]">
        <div className="flex flex-wrap border-gray mb-[30px] gap-2 items-center">
          <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={fetchedUserData.profileImage || "/fallback-profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-white text-xl font-medium">
              {fetchedUserData.firstName} {fetchedUserData.lastName}
            </h2>
            <div className="flex items-center gap-1">
              <HiOutlineBriefcase color="white" size={24} />
              <p className="text-white text-[16px] font-light">
                {fetchedUserData.jobTitle}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineMail color="white" size={24} />
              <p className="text-white text-[16px] font-light">
                {fetchedUserData.email}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-auto">
          <Button
            title="Edit Profile"
            onClick={handleEditProfile}
            icon={FaEdit}
            className="bg-[#E25319] text-white px-4 py-2 rounded-lg hover:bg-[#d14917] transition-colors flex items-center"
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default UserInfoSection;
