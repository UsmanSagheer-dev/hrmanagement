"use client";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { signOut } from "next-auth/react";
import IMAGES from "@/app/assets/images";
import Link from "next/link";
import { useUserProfile } from "@/app/hooks/useUserProfile";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialUserData?: UserData | null;
}

const UserProfileDropdown: React.FC<Props> = ({ initialUserData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userData, isLoading } = useUserProfile(initialUserData);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  if (isLoading || !userData) {
    return (
      <div className="h-[50px] w-[200px] animate-pulse bg-gray-700 rounded-lg" />
    );
  }

  const getAvatarUrl = (url?: string) => {
    if (!url) return IMAGES.Profileimg.src;

    if (url.includes("cloudinary.com")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}t=${new Date().getTime()}`;
    }

    return url;
  };

  const avatarUrl = getAvatarUrl(userData.avatar);

  return (
    <div className="relative">
      <div
        className="flex items-center h-[40px] md:h-[50px] space-x-2 border border-[#A2A1A833] rounded-[8px] px-[5px] cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="relative w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded overflow-hidden">
          <img
            key={avatarUrl}
            src={avatarUrl}
            alt={`${userData.name}'s avatar`}
            className="w-full h-full rounded object-cover"
            onError={(e) => {
              console.error("Image load error");
              e.currentTarget.src = IMAGES.Profileimg.src;
            }}
          />
        </div>
        <div>
          <p className="text-[14px] md:text-[16px] font-semibold text-white">
            {userData.name}
          </p>
          <p className="text-xs font-light text-gray-400">{userData.role}</p>
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
