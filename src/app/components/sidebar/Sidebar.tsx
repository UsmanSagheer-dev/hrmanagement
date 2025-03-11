"use client";
import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers, FaCog } from "react-icons/fa";
import { LuCalendarCheck } from "react-icons/lu";
import { LuCalendarRange } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import IMAGES from "@/app/assets/images";
import Button from "../button/Button";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC = () => {
  const router = useRouter();

  const initialMenuItems: MenuItem[] = [
    {
      id: 1,
      name: "Dashboard",
      icon: <RxDashboard size={24} />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "All Employees",
      icon: <FaUsers size={24} />,
      path: "/allEmployee",
    },
    {
      id: 3,
      name: "Attendance",
      icon: <LuCalendarCheck size={24} />,
      path: "/viewAttendace",
    },
    {
      id: 4,
      name: "Leaves",
      icon: <LuCalendarRange size={24} />,
      path: "/leaves",
    },
    {
      id: 5,
      name: "Settings",
      icon: <IoSettingsOutline size={24} />,
      path: "/settings",
    },
  ];

  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("dark");

  const handleItemClick = (id: number, path: string) => {
    setActiveItemId(id);
    router.push(path);
  };

  const handleThemeToggle = (theme: "light" | "dark") => {
    setActiveTheme(theme);
  };

  return (
    <div className="w-[64px] md:w-64 h-[95vh] bg-[#1a1a1a] text-white p-3 md:p-6 flex flex-col justify-between rounded-[20px] transition-all duration-300">
      <div className="flex items-center justify-center md:justify-start mb-[20px] md:mb-[41px]">
        <img
          src={IMAGES.HrLogo.src}
          alt=""
          className="w-[32px] md:w-[83px] h-[32px] cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />
      </div>

      <div className="flex-grow">
        <ul className="space-y-2 md:space-y-4">
          {initialMenuItems?.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item.id, item.path)}
              className={`
                flex items-center justify-center md:justify-start 
                px-2 md:px-[19px] py-[13px] gap-[8px] md:gap-[16px] 
                rounded relative
                ${
                  activeItemId === item.id
                    ? "bg-orange-400/30"
                    : "hover:bg-gray-700"
                }
                cursor-pointer transition-all duration-200
              `}
            >
              {activeItemId === item.id && (
                <span className="absolute left-0 top-0 h-full w-1 bg-orange-500 rounded-l"></span>
              )}
              <span
                className={`${
                  activeItemId === item.id ? "text-orange-500" : "text-white"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`
                  text-[16px] font-light hidden md:block
                  ${activeItemId === item.id ? "text-orange-500" : "text-white"}
                `}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 rounded p-2">
          <Button
            title="light"
            icon={MdLightMode}
            className={`
              w-full md:w-[110px] h-[40px] md:h-[50px] 
              cursor-pointer flex items-center justify-center rounded 
              ${
                activeTheme === "light"
                  ? "bg-orange-500 text-white"
                  : "bg-[#A2A1A80D] text-white"
              }
            `}
            onClick={() => handleThemeToggle("light")}
          />
          <Button
            title="dark"
            icon={MdDarkMode}
            className={`
              w-full md:w-[110px] h-[40px] md:h-[50px] 
              cursor-pointer flex items-center justify-center rounded 
              ${
                activeTheme === "dark"
                  ? "bg-orange-500 text-white"
                  : "bg-[#A2A1A80D] text-white"
              }
            `}
            onClick={() => handleThemeToggle("dark")}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
