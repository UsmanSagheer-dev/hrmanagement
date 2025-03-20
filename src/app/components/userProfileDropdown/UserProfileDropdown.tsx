import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { signOut } from "next-auth/react";
import IMAGES from "@/app/assets/images";

interface User {
  name: string;
  role: string;
}

interface UserProfileDropdownProps {
  user: User;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  isDropdownOpen,
  toggleDropdown,
}) => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="relative">
      <div
        className="flex items-center h-[40px] md:h-[50px] space-x-2 border border-[#A2A1A833] rounded-[8px] px-[5px] cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src={IMAGES.Profileimg.src}
          alt={`${user.name}'s avatar`}
          className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded"
        />
        <div>
          <p className="text-[14px] md:text-[16px] font-semibold">
            {user.name}
          </p>
          <p className="text-xs font-light text-gray-400">{user.role}</p>
        </div>
        <MdKeyboardArrowDown size={20} />
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
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Sign clicked")}
            >
              Sign
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Update clicked")}
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