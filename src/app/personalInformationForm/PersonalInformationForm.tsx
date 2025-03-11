'use client';
import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { IoIosPerson } from 'react-icons/io';
import { HiOutlineBriefcase } from 'react-icons/hi2';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdLockOpen } from 'react-icons/md';
import InputField from '../components/inputField/InputField';
import Button from '../components/button/Button';

type PersonalInformationFormProps = {
  onTabChange: (tabName: string) => void;
};

type FormData = {
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
  profileImage?: File | null;
};

const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const nationalityOptions = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
];

const cityOptions = [
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'hyderabad', label: 'Hyderabad' },
];

const stateOptions = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'delhi', label: 'Delhi' },
];

const zipCodeOptions = [
  { value: '400001', label: '400001' },
  { value: '110001', label: '110001' },
  { value: '560001', label: '560001' },
  { value: '500001', label: '500001' },
];

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ onTabChange }) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: null,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (files: FileList) => {
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTabChange('professional');
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      dateOfBirth: '',
      maritalStatus: '',
      gender: '',
      nationality: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      profileImage: null,
    });
    setProfileImagePreview(null);
  };

  const ProfileImageUpload = () => {
    return (
      <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
        {profileImagePreview ? (
          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
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
    isActive 
  }: { 
    Icon: any; 
    title: string; 
    tabName: string;
    isActive: boolean;
  }) => {
    return (
      <button
        onClick={() => onTabChange(tabName)}
        className={`flex items-center ${isActive ? 'text-[#E25319] border-b-2 border-[#E25319]' : 'text-white'} pb-2 mr-6`}
      >
        <div className={`w-6 h-6 ${isActive ? 'text-[#E25319]' : 'border-none'} flex items-center justify-center mr-2`}>
          <Icon className="text-lg" />
        </div>
        <span>{title}</span>
      </button>
    );
  };

  const inputFields = [
    {
      section: 'name',
      grid: 'grid-cols-1 md:grid-cols-2',
      fields: [
        { type: 'text' as const, placeholder: 'First Name', field: 'firstName' as keyof FormData },
        { type: 'text' as const, placeholder: 'Last Name', field: 'lastName' as keyof FormData },
      ]
    },
    {
      section: 'contact',
      grid: 'grid-cols-1 md:grid-cols-2',
      fields: [
        { type: 'text' as const, placeholder: 'Mobile Number', field: 'mobileNumber' as keyof FormData },
        { type: 'email' as const, placeholder: 'Email Address', field: 'email' as keyof FormData },
      ]
    },
    {
      section: 'personal',
      grid: 'grid-cols-1 md:grid-cols-2',
      fields: [
        { type: 'date' as const, placeholder: 'Date of Birth', field: 'dateOfBirth' as keyof FormData },
        { 
          type: 'select' as const, 
          placeholder: 'Marital Status', 
          field: 'maritalStatus' as keyof FormData,
          options: maritalStatusOptions 
        },
      ]
    },
    {
      section: 'identity',
      grid: 'grid-cols-1 md:grid-cols-2',
      fields: [
        { 
          type: 'select' as const, 
          placeholder: 'Gender', 
          field: 'gender' as keyof FormData,
          options: genderOptions 
        },
        { 
          type: 'select' as const, 
          placeholder: 'Nationality', 
          field: 'nationality' as keyof FormData,
          options: nationalityOptions 
        },
      ]
    },
    {
      section: 'address',
      grid: 'grid-cols-1',
      fields: [
        { type: 'text' as const, placeholder: 'Address', field: 'address' as keyof FormData },
      ]
    },
    {
      section: 'location',
      grid: 'grid-cols-1 md:grid-cols-3',
      fields: [
        { 
          type: 'select' as const, 
          placeholder: 'City', 
          field: 'city' as keyof FormData,
          options: cityOptions 
        },
        { 
          type: 'select' as const, 
          placeholder: 'State', 
          field: 'state' as keyof FormData,
          options: stateOptions 
        },
        { 
          type: 'select' as const, 
          placeholder: 'ZIP Code', 
          field: 'zipCode' as keyof FormData,
          options: zipCodeOptions 
        },
      ]
    },
  ];

  return (
    <div className="h-[84vh] bg-transparent border border-[#A2A1A833] rounded-[10px] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap border-b border-gray-700">
          <NavigationTab Icon={IoIosPerson} title="Personal Information" tabName="personal" isActive={true} />
          <NavigationTab Icon={HiOutlineBriefcase} title="Professional Information" tabName="professional" isActive={false} />
          <NavigationTab Icon={IoDocumentTextOutline} title="Documents" tabName="documents" isActive={false} />
          <NavigationTab Icon={MdLockOpen} title="Account Access" tabName="account" isActive={false} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-start mt-[30px] mb-5">
            <ProfileImageUpload />
          </div>

          {inputFields.map((section) => (
            <div key={section.section} className={`grid ${section.grid} gap-4 mb-5`}>
              {section.fields.map((input) => (
                <InputField
                  key={input.field}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.field]}
                  onChange={(value) => handleInputChange(input.field, value)}
                  options={input.options}
                  required
                  className='border border-[#A2A1A833]'
                />
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <Button
              title="Cancel"
              onClick={handleCancel}
              className="w-[91px] h-[50px] bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            />
            <Button
              title="Next"
              className="w-[91px] h-[50px] bg-[#E25319] text-white rounded-lg hover:bg-[#d14917] transition-colors"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;