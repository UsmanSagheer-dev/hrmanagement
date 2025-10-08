"use client";
import React, { useState } from "react";
import IMAGES from "../assets/images";
import { ProfileContent } from "../content/profileContent/ProfileContent";
import { ProjectsContent } from "../content/projectsContent/ProjectsContent";
import { IoIosPerson } from "react-icons/io";
import { LuCalendarCheck, LuCalendarRange } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import AttendanceContent from "../content/attendanceContent/AttendanceContent";
import LeaveContent from "../content/leaveContent/LeaveContent";
import { useRouter } from "next/navigation";
import UserInfoSection from "../components/UserInfoSection/UserInfoSection";
import { UserData } from "../types/types";

const ProfileDetails: React.FC = () => {
  const router = useRouter();
  const [userData] = useState<UserData>({
    firstName: "Dina",
    lastName: "Coneva",
    mobileNumber: "(373) 666-0666",
    email: "dina.c@gmail.com",
    dateOfBirth: "July 20, 1992",
    maritalStatus: "Married",
    gender: "Female",
    nationality: "Ruskiy",
    address: "666 Hell 000",
    city: "Chisinau",
    state: "Moldova",
    zipCode: "00666",
    profileImage: IMAGES.Profileimg.src,
    jobTitle: "Project Manager",
    attendance: {
      presentDays: 22,
      absentDays: 3,
      lastCheckIn: "March 10, 2025 9:00 AM",
    },
    employeeId: "EMP001",
    userName: "dina_coneva",
    employeeType: "Full-time",
    emailAddress: "dina.c@gmail.com",
    department: "IT",
    designation: "Project Manager",
    workingDays: "30 days",
    joiningDate: "January 10, 2021",
    officeLocation: "Chisinau",
    skypeId: "usman",
    githubId: "dina_coneva",
    slackId: "dina_coneva",
  });
  const handleEditProfile = () => {
    router.push("/employee/add");
  };
  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <ProfileContent
            userData={userData} // Pass userData explicitly
            activeProfileTab={activeProfileTab}
            setActiveProfileTab={setActiveProfileTab}
            employeeId={userData.employeeId || ""} // Ensure employeeId is always a string
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
            userData={userData} // Pass userData explicitly
            activeProfileTab={activeProfileTab}
            setActiveProfileTab={setActiveProfileTab}
            employeeId={userData.employeeId || ""} // Ensure employeeId is always a string
          />
        );
    }
  };

  return (
    <div className="h-auto max-h-[81vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 ">
        <UserInfoSection
          employeeId={userData.employeeId} // Pass employeeId instead of userData
          handleEditProfile={handleEditProfile}
        />
        <div className="flex flex-wrap scroll-auto overflow-auto mt-[30px] mb-[30px] md:flex-nowrap">
          <div className="w-full md:w-[242px] mb-4 md:mb-0">
            <div className="border border-[#A2A1A833] rounded-md">
              <nav className="space-y-2 ">
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
      </div>
    </div>
  );
};

export default ProfileDetails;
