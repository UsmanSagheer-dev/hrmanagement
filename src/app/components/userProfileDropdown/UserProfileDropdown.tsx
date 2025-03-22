"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { signOut } from "next-auth/react";
import IMAGES from "@/app/assets/images";
import Link from "next/link";
import { useAdmin } from "@/app/hooks/useAdmin";


interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface UserProfileDropdownProps {
  user?: User; 
  isDropdownOpen?: boolean;
  toggleDropdown?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user: propUser,
  isDropdownOpen: propIsDropdownOpen,
  toggleDropdown: propToggleDropdown,
}) => {
  const [isDropdownOpenInternal, setIsDropdownOpenInternal] = useState(false);
  const { adminData, isLoading, error, updateAdmin } = useAdmin();

  const isDropdownOpen = propIsDropdownOpen !== undefined ? propIsDropdownOpen : isDropdownOpenInternal;
  const toggleDropdown = propToggleDropdown || (() => setIsDropdownOpenInternal(!isDropdownOpenInternal));

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  if (isLoading) {
    return <div className="text-white">Loading user data...</div>;
  }

  const user = adminData
    ? { name: adminData.name, role: adminData.role, avatar: IMAGES.Profileimg.src }
    : propUser || { name: "Unknown", role: "Unknown", avatar: IMAGES.Profileimg.src };

  const handleUpdate = async () => {
    const newName = prompt("Enter new name:", user.name);
    if (newName && adminData) {
      await updateAdmin({ name: newName });
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center h-[40px] md:h-[50px] space-x-2 border border-[#A2A1A833] rounded-[8px] px-[5px] cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src={user.avatar || IMAGES.Profileimg.src}
          alt={`${user.name}'s avatar`}
          className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded"
        />
        <div>
          <p className="text-[14px] md:text-[16px] font-semibold text-white">
            {user.name}
          </p>
          <p className="text-xs font-light text-gray-400">{user.role}</p>
        </div>
        <MdKeyboardArrowDown size={20} className="text-white" />
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-[8px] shadow-lg z-20">
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
            <Link href="/profile">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </li>
            </Link>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleUpdate}
            >
              Update
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;