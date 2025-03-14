"use client";
import React, { useState } from "react";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import FileUpload from "../../components/fileUpload/UploadFile";
import Button from "../../components/button/Button";

type DocumentsTabProps = {
  onTabChange: (tabName: string) => void;
};

type FormData = {
  employeeId: string;
};

const DocumentsForm: React.FC<DocumentsTabProps> = ({ onTabChange }) => {
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {}
  );

  const handleFileUpload = (file: File, type: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
    console.log(`${type} uploaded:`, file.name);
  };

  const handleCancel = () => {
    setFormData({
      employeeId: "",
    });
    setUploadedFiles({});
    onTabChange("professional");
  };

  const handleNext = () => {
    if (Object.keys(uploadedFiles).length === documents.length) {
      onTabChange("account");
    }
  };

  const documents = [
    { id: "appointment-letter", title: "Appointment Letter" },
    { id: "salary-slips", title: "Salary Slips" },
    { id: "relieving-letter", title: "Relieving Letter" },
    { id: "experience-letter", title: "Experience Letter" },
  ];

  const NavigationTab = ({
    Icon,
    title,
    tabName,
    isActive,
  }: {
    Icon: any;
    title: string;
    tabName: string;
    isActive: boolean;
  }) => {
    return (
      <button
        onClick={() => onTabChange(tabName)}
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
  };

  const isNextDisabled = Object.keys(uploadedFiles).length < documents.length;

  return (
    <div className="h-[70vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex border-b border-gray-700 flex-wrap">
          <NavigationTab
            Icon={IoIosPerson}
            title="Personal Information"
            tabName="personal"
            isActive={false}
          />
          <NavigationTab
            Icon={HiOutlineBriefcase}
            title="Professional Information"
            tabName="professional"
            isActive={false}
          />
          <NavigationTab
            Icon={IoDocumentTextOutline}
            title="Documents"
            tabName="documents"
            isActive={true}
          />
          <NavigationTab
            Icon={MdLockOpen}
            title="Account Access"
            tabName="account"
            isActive={false}
          />
        </div>

        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <FileUpload
              key={doc.id}
              id={doc.id}
              title={doc.title}
              onFileUpload={handleFileUpload}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            title="Cancel"
            onClick={handleCancel}
            className="w-[91px] h-[50px] bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          />
          <Button
            title="Next"
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`w-[91px] h-[50px] rounded-lg transition-colors ${
              isNextDisabled
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-[#E25319] text-white hover:bg-[#d14917]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;
