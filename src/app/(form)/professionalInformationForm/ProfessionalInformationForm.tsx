"use client";
import React, { useState, useEffect } from "react";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";
import { employeeTypeOptions, departmentOptions, workingDaysOptions, officeLocationOptions } from "../../constants/formConstants";
import { ProfessionalInformationFormProps } from "@/app/types/formTypes";
import InputField from "@/app/components/inputField/InputField";
import Button from "@/app/components/button/Button";

const ProfessionalInformationForm: React.FC<ProfessionalInformationFormProps> = ({ onTabChange }) => {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [localFormData, setLocalFormData] = useState(formData.professional);

  useEffect(() => {
    setLocalFormData(formData.professional);
  }, [formData.professional]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    updateFormData("professional", { [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("professional", localFormData);
    onTabChange("documents");
  };

  const handleCancel = () => {
    const resetData = {
      employeeId: "",
      userName: "",
      employeeType: "",
      workEmail: "",
      department: "",
      designation: "",
      workingDays: "",
      joiningDate: "",
      officeLocation: "",
    };
    setLocalFormData(resetData);
    updateFormData("professional", resetData);
  };

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

  return (
    <div className="h-[67vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex border-b border-gray-700 flex-wrap">
          <NavigationTab Icon={IoIosPerson} title="Personal Information" tabName="personal" isActive={false} />
          <NavigationTab Icon={HiOutlineBriefcase} title="Professional Information" tabName="professional" isActive={true} />
          <NavigationTab Icon={IoDocumentTextOutline} title="Documents" tabName="documents" isActive={false} />
          <NavigationTab Icon={MdLockOpen} title="Account Access" tabName="account" isActive={false} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-[30px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <InputField
                type="text"
                placeholder="Employee ID"
                value={localFormData.employeeId}
                onChange={(value) => handleInputChange("employeeId", value)}
                required
                className="border border-[#A2A1A833]"
              />
              <InputField
                type="text"
                placeholder="User Name"
                value={localFormData.userName}
                onChange={(value) => handleInputChange("userName", value)}
                required
                className="border border-[#A2A1A833]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <InputField
                type="select"
                placeholder="Select Employee Type"
                value={localFormData.employeeType}
                onChange={(value) => handleInputChange("employeeType", value)}
                options={employeeTypeOptions}
                required
                className="border border-[#A2A1A833]"
              />
              <InputField
                type="email"
                placeholder="Work Email Address"
                value={localFormData.workEmail}
                onChange={(value) => handleInputChange("workEmail", value)}
                required
                className="border border-[#A2A1A833]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <InputField
                type="select"
                placeholder="Select Department"
                value={localFormData.department}
                onChange={(value) => handleInputChange("department", value)}
                options={departmentOptions}
                required
                className="border border-[#A2A1A833]"
              />
              <InputField
                type="text"
                placeholder="Enter Designation"
                value={localFormData.designation}
                onChange={(value) => handleInputChange("designation", value)}
                required
                className="border border-[#A2A1A833]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <InputField
                type="select"
                placeholder="Select Working Days"
                value={localFormData.workingDays}
                onChange={(value) => handleInputChange("workingDays", value)}
                options={workingDaysOptions}
                required
                className="border border-[#A2A1A833]"
              />
              <InputField
                type="date"
                placeholder="Select Joining Date"
                value={localFormData.joiningDate}
                onChange={(value) => handleInputChange("joiningDate", value)}
                required
                className="border border-[#A2A1A833]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
              <InputField
                type="select"
                placeholder="Select Office Location"
                value={localFormData.officeLocation}
                onChange={(value) => handleInputChange("officeLocation", value)}
                options={officeLocationOptions}
                required
                className="border border-[#A2A1A833]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                title="Cancel"
                onClick={handleCancel}
                className="w-[91px] h-[50px] cursor-pointer bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              />
              <Button
                title="Next"
                className="w-[91px] h-[50px] cursor-pointer bg-[#E25319] text-white rounded-lg hover:bg-[#d14917] transition-colors"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalInformationForm;