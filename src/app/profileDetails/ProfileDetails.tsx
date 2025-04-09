"use client";
import React, { useState } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import Button from "../components/button/Button";
import IMAGES from "../assets/images";
import { ProfileContent } from "../(content)/profileContent/ProfileContent";
import { ProjectsContent } from "../(content)/projectsContent/ProjectsContent";
import { IoIosPerson } from "react-icons/io";
import { LuCalendarCheck, LuCalendarRange } from "react-icons/lu";
import { GrNotes } from "react-icons/gr";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import AttendanceContent from "../(content)/attendanceContent/AttendanceContent";
import LeaveContent from "../(content)/leaveContent/LeaveContent";
import { useRouter } from "next/navigation";
import UserInfoSection from "../components/UserInfoSection/UserInfoSection";

type ProfileDetailsProps = {
  onTabChange: (tabName: string) => void;
};

type UserData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  maritalStatus: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileImage?: string | null;
  jobTitle: string;
  attendance?: {
    presentDays: number;
    absentDays: number;
    lastCheckIn: string;
  };
  employeeID?: string;
  userName?: string;
  employeeType?: string;
  emailAdress?: string;
  department?: string;
  designation?: string;
  workingDays?: string;
  joinDate?: string;
  officeLocation?: string;
  skypeID?: string;
  githubID?: string;
  slackID?: string;
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ onTabChange }) => {
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
    employeeID: "EMP001",
    userName: "dina_coneva",
    employeeType: "Full-time",
    emailAdress: "dina.c@gmail.com",
    department: "IT",
    designation: "Project Manager",
    workingDays: "30 days",
    joinDate: "January 10, 2021",
    officeLocation: "Chisinau",
    skypeID: "usman",
    githubID: "dina_coneva",
    slackID: "dina_coneva",
  });
  const handleEditProfile = () => {
    router.push("/employee/add");
  };
  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");

  const ProfileImage = () => (
    <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
      <img
        src={userData.profileImage || IMAGES.Profileimg.src}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <ProfileContent
            userData={userData}
            activeProfileTab={activeProfileTab}
            setActiveProfileTab={setActiveProfileTab}
          />
        );
      case "attendance":
        return <AttendanceContent userData={userData} />;
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
          />
        );
    }
  };

  return (
    <div className="h-auto max-h-[81vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 ">
        <UserInfoSection userData={userData} handleEditProfile={handleEditProfile} />
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
