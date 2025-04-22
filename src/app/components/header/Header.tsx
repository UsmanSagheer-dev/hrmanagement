import React from "react";
import Button from "../button/Button";
import { IoMdNotificationsOutline } from "react-icons/io";
import SearchBar from "../searchBar/SearchBar";
import UserProfileDropdown from "../userProfileDropdown/UserProfileDropdown";
import { HeaderProps } from "../../types/types";
import { useHeader } from "./useHeader";

const Header: React.FC<HeaderProps> = ({ title, description, textColor }) => {
  const {
    isAdmin,
    unreadCount,
    handleNotificationClick,
    renderDescriptionWithIcon,
  } = useHeader(description, textColor);

  return (
    <header className="text-white flex items-center sticky top-0 z-10 py-2 md:py-[8px]">
      <div className="hidden md:flex text-justify flex-col space-x-4">
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        {renderDescriptionWithIcon()}
      </div>
      
      <div className="flex-grow"></div>
      <div className="flex items-center space-x-4">
        {isAdmin && (
          <>
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <div className="hidden md:block relative">
              <Button
                icon={IoMdNotificationsOutline}
                onClick={handleNotificationClick}
                className="bg-[#A2A1A81A] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </>
        )}
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;