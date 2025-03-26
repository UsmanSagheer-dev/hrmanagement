"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { signOut } from "next-auth/react";
import IMAGES from "@/app/assets/images";
import Link from "next/link";
import { useAdmin } from "@/app/hooks/useAdmin";

const UserProfileDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { adminData, isLoading } = useAdmin();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  if (isLoading || !adminData) {
    return (
      <div className="h-[50px] w-[200px] animate-pulse bg-gray-700 rounded-lg" />
    );
  }

  return (
    <div className="relative">
      <div
        className="flex items-center h-[40px] md:h-[50px] space-x-2 border border-[#A2A1A833] rounded-[8px] px-[5px] cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img
          src={adminData.avatar || IMAGES.Profileimg.src}
          alt={`${adminData.name}'s avatar`}
          className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded object-cover"
        />
        <div>
          <p className="text-[14px] md:text-[16px] font-semibold text-white">
            {adminData.name}
          </p>
          <p className="text-xs font-light text-gray-400">{adminData.role}</p>
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;