"use client";
import React, { useState, useEffect } from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import Button from "../button/Button";

type UserData = {
  firstName: string;
  lastName: string;
  jobTitle: string; // This will map to 'designation' from your DB
  email: string;
  profileImage?: string | null;
};

type UserInfoSectionProps = {
  employeeId?: string; // Optional prop to fetch specific employee
  handleEditProfile: () => void;
};

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  employeeId,
  handleEditProfile,
}) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const url = employeeId ? `/api/employee?id=${employeeId}` : "/api/employee";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        
        // If API returns an array (when no ID is provided), take first employee
        // If API returns single object (when ID is provided), use it directly
        const employee = Array.isArray(data) ? data[0] : data;

        // Map database fields to component's expected fields
        setUserData({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          jobTitle: employee.designation || "", // Using 'designation' as jobTitle
          email: employee.email || employee.workEmail || "",
          profileImage: employee.profileImage || null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [employeeId]); // Re-fetch if employeeId changes

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center mt-[20px] border-b border-[#A2A1A833]">
      <div className="flex flex-wrap border-gray mb-[30px] gap-2 items-center">
        <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={userData.profileImage || "/fallback-profile.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-white text-xl font-medium">
            {userData.firstName} {userData.lastName}
          </h2>
          <div className="flex items-center gap-1">
            <HiOutlineBriefcase color="white" size={24} />
            <p className="text-white text-[16px] font-light">
              {userData.jobTitle}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineMail color="white" size={24} />
            <p className="text-white text-[16px] font-light">
              {userData.email}
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
  );
};

export default UserInfoSection;