import React from "react";
import { ProfileContentProps, UserData } from "../../types/types";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import FileList from "../../components/fileList/FileList";



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
  <div className="mb-  border-b-[1px] border-[#A2A1A81A]">
    <p className="text-gray-500 text-sm font-light mb-1">{label}</p>
    <p className="text-white text-[16px] font-light mb-[8px]">{value}</p>
  </div>
);

export const ProfileContent: React.FC<ProfileContentProps> = ({
  userData,
  activeProfileTab,
  setActiveProfileTab,
}) => {
  const renderProfileTabContent = () => {
    switch (activeProfileTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <InfoSection label="First Name" value={userData.firstName} />
            <InfoSection label="Last Name" value={userData.lastName} />
            <InfoSection label="Mobile Number" value={userData.mobileNumber} />
            <InfoSection label="Email Address" value={userData.email} />
            <InfoSection label="Date of Birth" value={userData.dateOfBirth} />
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
            <InfoSection label="Employee ID" value={userData.employeeID} />
            <InfoSection label="User Name" value={userData.userName} />
            <InfoSection label="Employee Type" value={userData.employeeType} />
            <InfoSection label="Email Address" value={userData.emailAdress} />
            <InfoSection label="Department" value={userData.department} />
            <InfoSection label="Designation" value={userData.designation} />
            <InfoSection label="Working Days" value={userData.workingDays} />
            <InfoSection label="Joining Date" value={userData.joinDate} />

            <InfoSection
              label="Office Location"
              value={userData.officeLocation}
            />
          </div>
        );
      case "documents":
        return (
          <div className="mt-4  w-full">
            <FileList
              files={[
                {
                  id: "1",
                  name: "Appointment Letter.pdf",
                  path: "/documents/appointment-letter.pdf",
                },
                {
                  id: "2",
                  name: "Salary Slip_June.pdf",
                  path: "/documents/salary-slip-june.pdf",
                },
                {
                  id: "3",
                  name: "Salary Slip_May.pdf",
                  path: "/documents/salary-slip-may.pdf",
                },
                {
                  id: "4",
                  name: "Salary Slip_April.pdf",
                  path: "/documents/salary-slip-april.pdf",
                },
                {
                  id: "5",
                  name: "Reliving Letter.pdf",
                  path: "/documents/reliving-letter.pdf",
                },
                {
                  id: "6",
                  name: "Experience Letter.pdf",
                  path: "/documents/experience-letter.pdf",
                },
              ]}
              onView={(file) => {
                console.log(`Viewing file: ${file.name}`);
                window.open(file.path, "_blank");
              }}
              onDownload={(file) => {
                console.log(`Downloading file: ${file.name}`);
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
            <InfoSection label="Email Address" value={userData.emailAdress} />
            <InfoSection label="Slack ID" value={userData.slackID} />
            <InfoSection label="Slack ID" value={userData.skypeID} />
            <InfoSection label="Github ID" value={userData.githubID} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap border-b   border-gray-700   ">
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
  );
};
