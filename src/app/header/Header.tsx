"use client";
import React, { useState } from "react";
import Button from "../components/button/Button";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import SearchBar from "../components/searchBar/SearchBar";
import UserProfileDropdown from "../components/userProfileDropdown/UserProfileDropdown";
import { useUserProfile } from "@/app/hooks/useUserProfile"; 

interface HeaderProps {
  title: string;
  description: string;
  textColor?: string;
}

const Header: React.FC<HeaderProps> = ({ title, description, textColor }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userData } = useUserProfile(); 

  const handleNotificationClick = () => {
    window.location.href = "/notifications";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;