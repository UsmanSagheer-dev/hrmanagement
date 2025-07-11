"use client";
import React, { useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers, FaBuilding } from "react-icons/fa";
import { LuCalendarCheck } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger icon
import { IoClose } from "react-icons/io5"; // Close icon
import IMAGES from "@/app/assets/images";
import Button from "../button/Button";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MenuItem } from "@/app/types/types";
import Loader from "../loader/Loader";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role || "Employee";

  const allMenuItems: MenuItem[] = [
    {
      id: 1,
      name: "Dashboard",
      icon: <RxDashboard size={24} />,
      path: "/dashboard",
      roles: ["Admin"],
    },
    {
      id: 2,
      name: "All Employees",
      icon: <FaUsers size={24} />,
      path: "/employee/details",
      roles: ["Admin"],
    },
    {
      id: 3,
      name: "Attendance",
      icon: <LuCalendarCheck size={24} />,
      path: "/viewattendace",
      roles: ["Admin"],
    },
    {
      id: 5,
      name: "Settings",
      icon: <IoSettingsOutline size={24} />,
      path: "/settings",
      roles: ["Admin"],
    },
    {
      id: 6,
      name: "View Details",
      icon: <IoSettingsOutline size={24} />,
      path: "/viewemployeedetail",
      roles: ["Employee"],
    },
    {
      id: 7,
      name: "Department",
      icon: <FaBuilding size={24} />,
      path: "/department/alldepartment",
      roles: ["Admin"],
    },
  ];

  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("dark");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    if (status === "authenticated") {
      const filteredItems = allMenuItems.filter((item) =>
        item.roles.includes(userRole)
      );
      setMenuItems(filteredItems);
    }
  }, [status, userRole]);

  useEffect(() => {
    if (pathname && menuItems.length > 0) {
      const currentItem = menuItems.find((item) =>
        pathname.startsWith(item.path)
      );

      if (currentItem) {
        setActiveItemId(currentItem.id);
      } else {
        const defaultItem =
          userRole === "Admin"
            ? menuItems.find((item) => item.path === "/dashboard")
            : menuItems.find((item) => item.path === "/viewattendace");

        if (defaultItem) {
          setActiveItemId(defaultItem.id);
        }
      }
    }
  }, [pathname, menuItems, userRole]);

  const handleItemClick = (id: number, path: string) => {
    setActiveItemId(id);
    router.push(path);
    setIsSidebarOpen(false); 
  };

  const handleThemeToggle = (theme: "light" | "dark") => {
    setActiveTheme(theme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (status === "loading") {
    return (
      <div className="md:w-64 h-[95vh] bg-[#1a1a1a] hidden md:flex items-center justify-center">
        <div className="text-white">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden fixed top-[30px] left-[30px] z-50">
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
        </button>
      </div>

      <div
        className={`
          fixed top-0 left-0 h-[95vh] bg-[#1a1a1a] text-white p-3 md:p-6 
          flex flex-col justify-between rounded-[20px] transition-all duration-300
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
          md:w-64 md:translate-x-0 md:static z-40 overflow-hidden
        `}
      >
        <div className="flex items-center justify-center md:justify-start mb-[20px] md:mb-[41px]">
          <img
            src={IMAGES.HrLogo.src}
            alt=""
            className=" w-[83px] h-[32px] cursor-pointer"
            onClick={() => {
              router.push(userRole === "Admin" ? "/dashboard" : "/viewattendace");
              setIsSidebarOpen(false);
            }}
          />
        </div>

        <div className="flex-grow">
          <ul className="space-y-2 md:space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id, item.path)}
                className={`
                  flex items-center px-2 md:px-[19px] py-[13px] gap-[16px] 
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
                    text-[16px] font-light
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;