import React from "react";
import { ProfileContentProps } from "../../types/types";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import FileList from "../../components/fileList/FileList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserData from "./useUserData";
import Loader from "@/app/components/loader/Loader";

const NavigationTab = ({ Icon, title, tabName, isActive, onClick }: any) => (
  <button
    onClick={() => onClick(tabName)}
    className={`flex items-center ${
      isActive ? "text-[#E25319] border-b-2 border-[#E25319]" : "text-white"
    } pb-2 mr-6`}
  >
    <div
      className={`w-6 h-6 ${
        isActive ? "text-[#E25319]" : "border-none"
      } flex items-center justify-center mr-2`}
    >
      <Icon className="text-lg" />
    </div>
    <span>{title}</span>
  </button>
);

const InfoSection = ({ label, value }: { label: string; value: any }) => (
  <div className="mb- border-b-[1px] border-[#A2A1A81A]">
    <p className="text-gray-500 text-sm font-light mb-1">{label}</p>
    <p className="text-white text-[16px] font-light mb-[8px]">
      {value || "N/A"}
    </p>
  </div>
);

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeProfileTab,
  setActiveProfileTab,
  userData,
}) => {
  const { employeeId } = userData; // Access employeeId from userData
  const { loading, error } = useUserData(employeeId); // Removed unused fetchedUserData

  const getDocumentFiles = () => {
    if (!userData) return [];
    return [
      userData.appointmentLetter && {
        id: "1",
        name: "Appointment Letter",
        path: userData.appointmentLetter,
      },
      userData.salarySlips && {
        id: "2",
        name: "Salary Slips",
        path: userData.salarySlips,
      },
      userData.relievingLetter && {
        id: "3",
        name: "Relieving Letter",
        path: userData.relievingLetter,
      },
      userData.experienceLetter && {
        id: "4",
        name: "Experience Letter",
        path: userData.experienceLetter,
      },
    ].filter(Boolean) as { id: string; name: string; path: string }[];
  };

  const renderProfileTabContent = () => {
    if (loading) return <div className="mt-6 flex justify-center items-center h-auto"><Loader/></div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No data available</div>;

    switch (activeProfileTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <InfoSection label="First Name" value={userData.firstName} />
            <InfoSection label="Last Name" value={userData.lastName} />
            <InfoSection label="Mobile Number" value={userData.mobileNumber} />
            <InfoSection label="Email Address" value={userData.email} />
            <InfoSection
              label="Date of Birth"
              value={
                userData.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString()
                  : null
              }
            />
            <InfoSection
              label="Marital Status"
              value={userData.maritalStatus}
            />
            <InfoSection label="Gender" value={userData.gender} />
            <InfoSection label="Nationality" value={userData.nationality} />
            <InfoSection label="Address" value={userData.address} />
            <InfoSection label="City" value={userData.city} />
            <InfoSection label="State" value={userData.state} />
            <InfoSection label="Zip Code" value={userData.zipCode} />
          </div>
        );
      case "professional":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <InfoSection label="Employee ID" value={userData.employeeId} />
            <InfoSection label="User Name" value={userData.userName} />
            <InfoSection label="Employee Type" value={userData.employeeType} />
            <InfoSection label="Work Email" value={userData.workEmail} />
            <InfoSection label="Department" value={userData.department} />
            <InfoSection label="Designation" value={userData.designation} />
            <InfoSection label="Working Days" value={userData.workingDays} />
            <InfoSection
              label="Joining Date"
              value={
                userData.joiningDate
                  ? new Date(userData.joiningDate).toLocaleDateString()
                  : null
              }
            />
            <InfoSection
              label="Office Location"
              value={userData.officeLocation}
            />
          </div>
        );
      case "documents":
        return (
          <div className="mt-4 w-full">
            <FileList
              files={getDocumentFiles()}
              onView={(file) => {
                window.open(file.path, "_blank");
              }}
              onDownload={(file) => {
                const link = document.createElement("a");
                link.href = file.path;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
          </div>
        );
      case "account":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-7">
            <InfoSection label="Work Email" value={userData.workEmail} />
            <InfoSection label="Slack ID" value={userData.slackId} />
            <InfoSection label="Skype ID" value={userData.skypeId} />
            <InfoSection label="Github ID" value={userData.githubId} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-wrap border-b border-gray-700">
          <NavigationTab
            Icon={IoIosPerson}
            title="Personal Information"
            tabName="personal"
            isActive={activeProfileTab === "personal"}
            onClick={setActiveProfileTab}
          />
          <NavigationTab
            Icon={HiOutlineBriefcase}
            title="Professional Information"
            tabName="professional"
            isActive={activeProfileTab === "professional"}
            onClick={setActiveProfileTab}
          />
          <NavigationTab
            Icon={IoDocumentTextOutline}
            title="Documents"
            tabName="documents"
            isActive={activeProfileTab === "documents"}
            onClick={setActiveProfileTab}
          />
          <NavigationTab
            Icon={MdLockOpen}
            title="Account Access"
            tabName="account"
            isActive={activeProfileTab === "account"}
            onClick={setActiveProfileTab}
          />
        </div>
        {renderProfileTabContent()}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};
