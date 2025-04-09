"use client";
import React, { useState, useEffect } from "react";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import InputField from "../../components/inputField/InputField";
import Button from "../../components/button/Button";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";
import { AccountAccessFormProps } from "@/app/types/formTypes";

const AccountAccessForm: React.FC<AccountAccessFormProps> = ({
  onTabChange,
}) => {
  const { formData, updateFormData, submitEmployeeData, isLoading, formError } =
    useEmployeeFormContext();
  const [localFormData, setLocalFormData] = useState(formData.account);

  useEffect(() => {
    setLocalFormData(formData.account);
  }, [formData.account]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
    updateFormData("account", { [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("account", localFormData);
    await submitEmployeeData();
  };

  const handleCancel = () => {
    const resetData = {
      emailAddress: "",
      slackId: "",
      skypeId: "",
      githubId: "",
    };
    setLocalFormData(resetData);
    updateFormData("account", resetData);
  };

  const INPUT_FIELDS = [
    { type: "email", placeholder: "Email Address", field: "emailAddress" },
    { type: "text", placeholder: "Slack ID", field: "slackId" },
    { type: "text", placeholder: "Skype ID", field: "skypeId" },
    { type: "text", placeholder: "Github ID", field: "githubId" },
  ];

  return (
    <div className="h-[40vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex border-b border-gray-700 flex-wrap">
          {[
            {
              Icon: IoIosPerson,
              title: "Personal Information",
              tabName: "personal",
            },
            {
              Icon: HiOutlineBriefcase,
              title: "Professional Information",
              tabName: "professional",
            },
            {
              Icon: IoDocumentTextOutline,
              title: "Documents",
              tabName: "documents",
            },
            { Icon: MdLockOpen, title: "Account Access", tabName: "account" },
          ].map(({ Icon, title, tabName }, index) => (
            <button
              key={index}
              onClick={() => onTabChange(tabName)}
              className={`flex items-center ${
                tabName === "account"
                  ? "text-[#E25319] border-b-2 border-[#E25319]"
                  : "text-white"
              } pb-2 mr-6`}
            >
              <div
                className={`w-6 h-6 ${
                  tabName === "account" ? "text-[#E25319]" : "border-none"
                } flex items-center justify-center mr-2`}
              >
                <Icon className="text-lg" />
              </div>
              <span>{title}</span>
            </button>
          ))}
        </div>

        {formError && (
          <div className="mt-4 p-3 bg-red-900 text-white rounded-md">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-[30px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {INPUT_FIELDS.map(({ type, placeholder, field }) => (
                <InputField
                  key={field}
                  type={type}
                  placeholder={placeholder}
                  value={localFormData[field as keyof typeof localFormData]}
                  onChange={(value) => handleInputChange(field, value)}
                  required
                  className="border border-[#A2A1A833]"
                />
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                title="Cancel"
                onClick={handleCancel}
                className="w-[91px] h-[50px] bg-transparent border cursor-pointer border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              />
              <Button
                title={isLoading ? "Saving..." : "Add"}
                disabled={isLoading}
                className={`w-[91px] h-[50px] ${
                  isLoading ? "bg-gray-600" : "bg-[#E25319]"
                } text-white rounded-lg hover:bg-[#d14917] transition-colors cursor-pointer`}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountAccessForm;
