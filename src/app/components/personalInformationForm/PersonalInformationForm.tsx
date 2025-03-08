'use client'; 
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../inputField/InputField';
import { FaCamera } from 'react-icons/fa';
import { IoIosPerson } from 'react-icons/io';
import { HiOutlineBriefcase } from 'react-icons/hi2';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdLockOpen } from 'react-icons/md';
import Button from '../button/Button';

type PersonalInformationFormProps = {
  onSubmit?: (data: FormData) => void;
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

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({ onSubmit }) => {
  const router = useRouter();
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
    if (onSubmit) {
      onSubmit(formData);
    }
    router.push('/professional-information');
  };

  const handleCancel = () => {
    router.back();
  };

  const ProfileImageUpload = () => {
    return (
      <div className="relative w-24 h-24 border border-[#A2A1A833] bg-[#A2A1A80D] rounded-lg flex items-center justify-center overflow-hidden">
        {profileImagePreview ? (
          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-[#white]">
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
    isActive 
  }: { 
    Icon: any; 
    title: string; 
    isActive: boolean;
  }) => {
    return (
        <div className={`flex items-center ${isActive ? 'text-[#E25319] border-b-2 border-[#E25319]' : 'text-white'} pb-2 mr-6`}>
        <div className={`w-6 h-6 ${isActive ? ' text-[#E25319]' : 'border-none '}  flex items-center justify-center mr-2`}>
          <Icon className="text-lg " />
        </div>
        <span className=''>{title}</span>
      </div>
    );
  };

  return (
    <div className=" bg-transparent  text-white overflow-auto hide-vertical-scrollbar">
      <div className="container mx-auto px-4 py-5">
        <div className="flex border-b border-gray-700 ">
        <NavigationTab Icon={IoIosPerson} title="Personal Information" isActive={true} />
          <NavigationTab Icon={HiOutlineBriefcase} title="Professional Information" isActive={false} />
          <NavigationTab Icon={IoDocumentTextOutline} title="Documents" isActive={false} />
          <NavigationTab Icon={MdLockOpen} title="Account Access" isActive={false} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-start mt-[30px] mb-5 ">
            <ProfileImageUpload />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <InputField
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              required
              className='border border-[#A2A1A833]'
            />
            <InputField
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              required
              className='border border-[#A2A1A833]'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <InputField
              type="text"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={(value) => handleInputChange('mobileNumber', value)}
              required
              className='border border-[#A2A1A833]'
            />
            <InputField
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              className='border border-[#A2A1A833]'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <InputField
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(value) => handleInputChange('dateOfBirth', value)}
              required
              className='border border-[#A2A1A833]'
            />
            <InputField
              type="select"
              placeholder="Marital Status"
              value={formData.maritalStatus}
              onChange={(value) => handleInputChange('maritalStatus', value)}
              options={maritalStatusOptions}
              required
              className='border border-[#A2A1A833]'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <InputField
              type="select"
              placeholder="Gender"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              options={genderOptions}
              required
              className='border border-[#A2A1A833]'
            />
            <InputField
              type="select"
              placeholder="Nationality"
              value={formData.nationality}
              onChange={(value) => handleInputChange('nationality', value)}
              options={nationalityOptions}
              required
              className='border border-[#A2A1A833]'
            />
          </div>

          <div className="mb-5">
            <InputField
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              required
              className='border border-[#A2A1A833]'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InputField
              type="select"
              placeholder="City"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              options={cityOptions}
              required
              className='border border-[#A2A1A833]'
            />
            <InputField
              type="select"
              placeholder="State"
              value={formData.state}
              onChange={(value) => handleInputChange('state', value)}
              options={stateOptions}
              required
              className='border border-[#A2A1A833] placeholder-[#A2A1A8CC]"'
            />
            <InputField
              type="select"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(value) => handleInputChange('zipCode', value)}
              options={zipCodeOptions}
              required
              className='border border-[#A2A1A833] placeholder-[#A2A1A8CC]"'
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
            title='Cancel'
              onClick={handleCancel}
              className="w-[91px] h-[50px] bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"/>
            
           
             <Button
            title='Next'
              className="w-[91px] h-[50px] bg-[#E25319] text-white rounded-lg hover:bg-[#d14917] transition-colors"
            />
             
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;