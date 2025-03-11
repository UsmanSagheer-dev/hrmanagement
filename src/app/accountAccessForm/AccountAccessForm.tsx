"use client";
import React, { useState } from "react";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import InputField from "../components/inputField/InputField";
import Button from "../components/button/Button";

type AccountAccessFormProps = {
  onTabChange: (tabName: string) => void;
};

type FormData = {
  emailAddress: string;
  slackId: string;
  skypeId: string;
  githubId: string;
};

const AccountAccessForm: React.FC<AccountAccessFormProps> = ({ onTabChange }) => {
  const [formData, setFormData] = useState<FormData>({
    emailAddress: "",
    slackId: "",
    skypeId: "",
    githubId: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      emailAddress: "",
      slackId: "",
      skypeId: "",
      githubId: "",
    });
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

  const inputFields = [
    {
      type: "email" as const,
      placeholder: "Enter Email Address",
      field: "emailAddress" as keyof FormData,
    },
    {
      type: "text" as const,
      placeholder: "Enter Slack ID",
      field: "slackId" as keyof FormData,
    },
    {
      type: "text" as const,
      placeholder: "Enter Skype ID",
      field: "skypeId" as keyof FormData,
    },
    {
      type: "text" as const,
      placeholder: "Enter Github ID",
      field: "githubId" as keyof FormData,
    },
  ];

  return (
    <div className="h-[40vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
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
            isActive={false}
          />
          <NavigationTab
            Icon={MdLockOpen}
            title="Account Access"
            tabName="account"
            isActive={true}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mt-[30px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {inputFields.map((input) => (
                <InputField
                  key={input.field}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.field]}
                  onChange={(value) => handleInputChange(input.field, value)}
                  required
                  className="border border-[#A2A1A833]"
                />
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                title="Cancel"
                onClick={handleCancel}
                className="w-[91px] h-[50px] bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              />
              <Button
                title="Add"
                className="w-[91px] h-[50px] bg-[#E25319] text-white rounded-lg hover:bg-[#d14917] transition-colors"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountAccessForm;