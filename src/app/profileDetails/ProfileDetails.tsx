"use client";
import React, { useState } from "react";
import { ProfileContent } from "../content/profileContent/ProfileContent";
import { ProjectsContent } from "../content/projectsContent/ProjectsContent";
import { IoIosPerson } from "react-icons/io";
import { LuCalendarCheck, LuCalendarRange } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import AttendanceContent from "../content/attendanceContent/AttendanceContent";
import LeaveContent from "../content/leaveContent/LeaveContent";
import { useRouter } from "next/navigation";
import UserInfoSection from "../components/UserInfoSection/UserInfoSection";
import { useSession } from "next-auth/react";
import useUserData from "../content/profileContent/useUserData";

const ProfileDetails: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Fetch real user data instead of using mock data
  const { userData, loading, error } = useUserData(session?.user?.id);
  
  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");

  const handleEditProfile = () => {
    router.push("/employee/add");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading employee data...</div>
        </div>
      );
    }

    if (error || !userData) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            {error || "Failed to load employee data"}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <ProfileContent
            userData={userData}
            activeProfileTab={activeProfileTab}
            setActiveProfileTab={setActiveProfileTab}
            employeeId={userData.employeeId || ""}
          />
        );
      case "attendance":
        return <AttendanceContent employeeId={userData.employeeId} />;
      case "projects":
        return <ProjectsContent />;
      case "leave":
        return <LeaveContent />;
      default:
        return (
          <ProfileContent
            userData={userData}
            activeProfileTab={activeProfileTab}
            setActiveProfileTab={setActiveProfileTab}
            employeeId={userData.employeeId || ""}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="h-auto max-h-[81vh] bg-transparent border border-[#A2A1A833] rounded-[10px] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-auto max-h-[81vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4">
        {userData && (
          <>
            <UserInfoSection
              employeeId={userData.employeeId}
              handleEditProfile={handleEditProfile}
            />
            <div className="flex flex-wrap scroll-auto overflow-auto mt-[30px] mb-[30px] md:flex-nowrap">
              <div className="w-full md:w-[242px] mb-4 md:mb-0">
                <div className="border border-[#A2A1A833] rounded-md">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveSection("profile")}
                      className={`flex items-center p-2 w-full text-left rounded-md ${
                        activeSection === "profile"
                          ? "bg-orange-500 text-white"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">
                        <IoIosPerson />
                      </span>
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveSection("attendance")}
                      className={`flex items-center p-2 w-full text-left rounded-md ${
                        activeSection === "attendance"
                          ? "bg-orange-500 text-white"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">
                        <LuCalendarCheck size={24} />
                      </span>
                      Attendance
                    </button>
                    <button
                      onClick={() => setActiveSection("projects")}
                      className={`flex items-center p-2 w-full text-left rounded-md ${
                        activeSection === "projects"
                          ? "bg-orange-500 text-white"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">
                        <GrNotes />
                      </span>
                      Projects
                    </button>
                    <button
                      onClick={() => setActiveSection("leave")}
                      className={`flex items-center p-2 w-full text-left rounded-md ${
                        activeSection === "leave"
                          ? "bg-orange-500 text-white"
                          : "text-white hover:bg-gray-700"
                      }`}
                    >
                      <span className="mr-2">
                        <LuCalendarRange size={24} />
                      </span>
                      Leave
                    </button>
                  </nav>
                </div>
              </div>
              <div className="flex-1 md:ml-6 w-full">{renderContent()}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;