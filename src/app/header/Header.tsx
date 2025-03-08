import React from "react";
import Button from "../components/button/Button";
import { IoMdNotificationsOutline } from "react-icons/io";
import IMAGES from "../assets/images";
import { MdKeyboardArrowDown } from "react-icons/md";
import SearchBar from "../components/searchBar/SearchBar";

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const user: User = {
    name: "usman",
    role: "HR Manager",
    avatar: "https://via.placeholder.com/40",
  };

  return (
    <header className="text-white flex justify-between items-center sticky top-0 z-10 py-2 md:py-[8px]">
      <div className="flex text-justify flex-col space-x-4">
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        <p className="text-sm md:text-base">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* SearchBar - hidden on tablet and below */}
        <div className="hidden md:block">
          <SearchBar />
        </div>
        {/* Notification Button - hidden on tablet and below */}
        <div className="hidden md:block">
          <Button 
            icon={IoMdNotificationsOutline} 
            className="bg-[#A2A1A81A] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer" 
          />
        </div>
        <div className="flex items-center h-[40px] md:h-[50px] space-x-2 border border-[#A2A1A833] rounded-[8px] px-[5px]">
          <img
            src={IMAGES.Profileimg.src}
            alt={`${user.name}'s avatar`}
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded"
          />
          <div>
            <p className="text-[14px] md:text-[16px] font-semibold">{user.name}</p>
            <p className="text-xs font-light text-gray-400">{user.role}</p>
          </div>
          <MdKeyboardArrowDown size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;