"use client";
import React from "react";
import { FaCamera } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import InputField from "../../components/inputField/InputField";
import Button from "../../components/button/Button";
import { PersonalInformationFormProps } from "../../types/formTypes";
import { usePersonalInformationForm } from "./usePersonalInformationForm";
import { inputFields } from "@/app/constants/inputFields";

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  onTabChange,
}) => {
  const {
    localFormData,
    profileImagePreview,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleCancel,
  } = usePersonalInformationForm({ onTabChange });

  const ProfileImageUpload = () => (
    <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
      {profileImagePreview ? (
        <img
          src={profileImagePreview}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-white">
          <FaCamera size={32} />
        </div>
      )}
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => e.target.files && handleImageChange(e.target.files)}
        accept="image/*"
      />
    </div>
  );

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
  }) => (
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

  return (
    <div className="h-[84vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap border-b border-gray-700">
          <NavigationTab
            Icon={IoIosPerson}
            title="Personal Information"
            tabName="personal"
            isActive={true}
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
            isActive={false}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-start mt-[30px] mb-5">
            <ProfileImageUpload />
          </div>

          {inputFields.map((section) => (
            <div
              key={section.section}
              className={`grid ${section.grid} gap-4 mb-5`}
            >
              {section.fields.map((input) => (
                <InputField
                  key={input.field}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={
                    localFormData[
                      input.field as keyof typeof localFormData
                    ] as string
                  }
                  onChange={(value) => handleInputChange(input.field, value)}
                  options={input.options}
                  required
                  className="border border-[#A2A1A833]"
                />
              ))}
            </div>
          ))}

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
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
