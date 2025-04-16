import React from "react";
import Button from "../button/Button";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import SearchBar from "../searchBar/SearchBar";
import UserProfileDropdown from "../userProfileDropdown/UserProfileDropdown";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useNotifications } from "@/app/hooks/useNotifications";
import { HeaderProps } from "../../types/types";

const Header: React.FC<HeaderProps> = ({ title, description, textColor }) => {
  const { userData } = useUserProfile();
  const { unreadCount } = useNotifications();
  const isAdmin = userData?.role === "Admin";
  const handleNotificationClick = () => {
    window.location.href = "/notifications";
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
