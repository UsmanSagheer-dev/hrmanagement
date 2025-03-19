import React, { useState } from "react";
import Button from "../components/button/Button";
import { IoMdNotificationsOutline } from "react-icons/io";
import IMAGES from "../assets/images";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import SearchBar from "../components/searchBar/SearchBar";
import { signOut } from "next-auth/react"; 

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface HeaderProps {
  title: string;
  description: string;
  textColor?: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, textColor }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNotificationClick = () => {
    window.location.href = "/notifications";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const user: User = {
    name: "usman",
    role: "HR Manager",
    avatar: "https://via.placeholder.com/40",
  };

  const renderDescriptionWithIcon = () => {
    const hasBreadcrumb = description.includes(">");
    if (hasBreadcrumb) {
      const parts = description.split(">");
      return (
        <div className="flex items-center space-x-2">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span
                className="text-sm md:text-base"
                style={{ color: textColor }}
              >
                {part.trim()}
              </span>
              {index < parts.length - 1 && <MdKeyboardArrowRight size={20} />}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return (
      <p className="text-sm md:text-base" style={{ color: textColor }}>
        {description}
      </p>
    );
  };

  return (
    <header className="text-white flex justify-between items-center sticky top-0 z-10 py-2 md:py-[8px]">
      <div className="flex text-justify flex-col space-x-4">
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        {renderDescriptionWithIcon()}
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="hidden md:block">
          <Button
            icon={IoMdNotificationsOutline}
            onClick={handleNotificationClick}
            className="bg-[#A2A1A81A] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer"
          />
        </div>
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
                  onClick={handleLogout} // Call logout handler
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
      </div>
    </header>
  );
};

export default Header;