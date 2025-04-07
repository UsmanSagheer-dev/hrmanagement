"use client";
import React from "react";

type PersonalInfoContentProps = {
  userData: {
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
  };
  onTabChange: (tabName: string) => void;
};

const InfoSection = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="mb-4">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
};

const PersonalInfoContent: React.FC<PersonalInfoContentProps> = ({
  userData,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <InfoSection label="First Name" value={userData.firstName} />
        <InfoSection label="Last Name" value={userData.lastName} />
        <InfoSection label="Mobile Number" value={userData.mobileNumber} />
        <InfoSection label="Email Address" value={userData.email} />
        <InfoSection label="Date of Birth" value={userData.dateOfBirth} />
        <InfoSection label="Marital Status" value={userData.maritalStatus} />
        <InfoSection label="Gender" value={userData.gender} />
        <InfoSection label="Nationality" value={userData.nationality} />
        <div className="col-span-1 md:col-span-2">
          <InfoSection label="Address" value={userData.address} />
        </div>
        <InfoSection label="City" value={userData.city} />
        <InfoSection label="State" value={userData.state} />
        <InfoSection label="Zip Code" value={userData.zipCode} />
      </div>
    </div>
  );
};

export default PersonalInfoContent;
