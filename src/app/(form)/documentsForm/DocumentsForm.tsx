"use client";
import React, { useState, useEffect } from "react";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import FileUpload from "../../components/fileUpload/UploadFile";
import Button from "../../components/button/Button";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";
import { DocumentsTabProps } from "@/app/types/types";


const DocumentsForm: React.FC<DocumentsTabProps> = ({ onTabChange }) => {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});

  useEffect(() => {
    setUploadedFiles(formData.documents);
  }, [formData.documents]);

  const handleFileUpload = (file: File, type: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
    updateFormData("documents", { [type]: file });
  };

  const handleCancel = () => {
    setUploadedFiles({});
    updateFormData("documents", {
      appointmentLetter: null,
      salarySlips: null,
      relievingLetter: null,
      experienceLetter: null,
    });
    onTabChange("professional");
  };

  const handleNext = () => {
    updateFormData("documents", uploadedFiles);
    onTabChange("account");
  };

  const documents = [
    { id: "appointmentLetter", title: "Appointment Letter" },
    { id: "salarySlips", title: "Salary Slips" },
    { id: "relievingLetter", title: "Relieving Letter" },
    { id: "experienceLetter", title: "Experience Letter" },
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
          isActive ? "text-[#E25319] border-b-2 border-[#E74219]" : "text-white"
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

  return (
    <div className="h-[70vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex border-b border-gray-700 flex-wrap">
          <NavigationTab Icon={IoIosPerson} title="Personal Information" tabName="personal" isActive={false} />
          <NavigationTab Icon={HiOutlineBriefcase} title="Professional Information" tabName="professional" isActive={false} />
          <NavigationTab Icon={IoDocumentTextOutline} title="Documents" tabName="documents" isActive={true} />
          <NavigationTab Icon={MdLockOpen} title="Account Access" tabName="account" isActive={false} />
        </div>

        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id}>
              <FileUpload
                id={doc.id}
                title={doc.title}
                onFileUpload={handleFileUpload}
                accept="application/pdf" 
              />
              {uploadedFiles[doc.id] && (
                <p className="text-sm text-gray-400 mt-2">{uploadedFiles[doc.id].name}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            title="Cancel"
            onClick={handleCancel}
            className="w-[91px] h-[50px] cursor-pointer bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          />
          <Button
            title="Next"
            onClick={handleNext}
            className="w-[91px] h-[50px] rounded-lg transition-colors cursor-pointer bg-[#E25319] text-white hover:bg-[#d14917]"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;