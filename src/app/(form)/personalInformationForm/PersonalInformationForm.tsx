"use client";
import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";
import InputField from "../../components/inputField/InputField";
import Button from "../../components/button/Button";
import { PersonalInformationFormProps } from "../../types/formTypes";
import {
  maritalStatusOptions,
  genderOptions,
  nationalityOptions,
  cityOptions,
  stateOptions,
  zipCodeOptions,
} from "../../constants/formConstants";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  onTabChange,
}) => {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const [localFormData, setLocalFormData] = useState(formData.personal);

  useEffect(() => {
    setLocalFormData(formData.personal);
    if (formData.personal.profileImage) {
      if (formData.personal.profileImage instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfileImagePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(formData.personal.profileImage);
      } else if (typeof formData.personal.profileImage === "string") {
        setProfileImagePreview(formData.personal.profileImage);
      }
    }
  }, [formData.personal]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    updateFormData("personal", { [field]: value });
  };

  const handleImageChange = (files: FileList) => {
    const file = files[0];
    updateFormData("personal", { profileImage: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("personal", localFormData);
    onTabChange("professional");
  };

  const handleCancel = () => {
    const resetData = {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      dateOfBirth: "",
      maritalStatus: "",
      gender: "",
      nationality: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      profileImage: null,
    };
    setLocalFormData(resetData);
    updateFormData("personal", resetData);
    setProfileImagePreview(null);
  };

  const ProfileImageUpload = () => {
    return (
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
      section: "name",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "text" as const,
          placeholder: "First Name",
          field: "firstName",
        },
        { type: "text" as const, placeholder: "Last Name", field: "lastName" },
      ],
    },
    {
      section: "contact",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "text" as const,
          placeholder: "Mobile Number",
          field: "mobileNumber",
        },
        {
          type: "email" as const,
          placeholder: "Email Address",
          field: "email",
        },
      ],
    },
    {
      section: "personal",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "date" as const,
          placeholder: "Date of Birth",
          field: "dateOfBirth",
        },
        {
          type: "select" as const,
          placeholder: "Marital Status",
          field: "maritalStatus",
          options: maritalStatusOptions,
        },
      ],
    },
    {
      section: "identity",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "select" as const,
          placeholder: "Gender",
          field: "gender",
          options: genderOptions,
        },
        {
          type: "select" as const,
          placeholder: "Nationality",
          field: "nationality",
          options: nationalityOptions,
        },
      ],
    },
    {
      section: "address",
      grid: "grid-cols-1",
      fields: [
        { type: "text" as const, placeholder: "Address", field: "address" },
      ],
    },
    {
      section: "location",
      grid: "grid-cols-1 md:grid-cols-3",
      fields: [
        {
          type: "select" as const,
          placeholder: "City",
          field: "city",
          options: cityOptions,
        },
        {
          type: "select" as const,
          placeholder: "State",
          field: "state",
          options: stateOptions,
        },
        {
          type: "select" as const,
          placeholder: "ZIP Code",
          field: "zipCode",
          options: zipCodeOptions,
        },
      ],
    },
  ];

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
              className="w-[91px] h-[50px] cursor-pointer bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors "
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
