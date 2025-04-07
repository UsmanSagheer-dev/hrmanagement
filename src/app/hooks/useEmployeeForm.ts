"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  personal: {
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
  professional: {
    employeeId: string;
    userName: string;
    employeeType: string;
    workEmail: string;
    department: string;
    designation: string;
    workingDays: string;
    joiningDate: string;
    officeLocation: string;
  };
  documents: {
    appointmentLetter?: File | null;
    salarySlips?: File | null;
    relievingLetter?: File | null;
    experienceLetter?: File | null;
  };
  account: {
    emailAddress: string;
    slackId: string;
    skypeId: string;
    githubId: string;
  };
}

export function useEmployeeForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    personal: {
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
    },
    professional: {
      employeeId: "",
      userName: "",
      employeeType: "",
      workEmail: "",
      department: "",
      designation: "",
      workingDays: "",
      joiningDate: "",
      officeLocation: "",
    },
    documents: {
      appointmentLetter: null,
      salarySlips: null,
      relievingLetter: null,
      experienceLetter: null,
    },
    account: {
      emailAddress: "",
      slackId: "",
      skypeId: "",
      githubId: "",
    },
  });

  const handleTabChange = useCallback((tabName: string) => {
    setActiveTab(tabName);
  }, []);

  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    return URL.createObjectURL(file); 
  };

  const submitEmployeeData = async () => {
    try {
      setIsLoading(true);
      setFormError(null);

      const profileImageUrl = formData.personal.profileImage 
        ? await uploadFile(formData.personal.profileImage) 
        : null;

      const documentUrls = {
        appointmentLetter: formData.documents.appointmentLetter 
          ? await uploadFile(formData.documents.appointmentLetter) 
          : null,
        salarySlips: formData.documents.salarySlips 
          ? await uploadFile(formData.documents.salarySlips) 
          : null,
        relievingLetter: formData.documents.relievingLetter 
          ? await uploadFile(formData.documents.relievingLetter) 
          : null,
        experienceLetter: formData.documents.experienceLetter 
          ? await uploadFile(formData.documents.experienceLetter) 
          : null,
      };

      const employeeData = {
        ...formData.personal,
        ...formData.professional,
        ...documentUrls,
        slackId: formData.account.slackId,
        skypeId: formData.account.skypeId,
        githubId: formData.account.githubId,
        workEmail: formData.professional.workEmail || formData.personal.email,
        profileImage: profileImageUrl,
      };

      const response = await fetch('/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save employee data");
      }

      router.push('/employee/details');
    } catch (error: any) {
      console.error("Error submitting employee data:", error);
      setFormError(error.message || "An error occurred while saving the employee data");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeTab,
    handleTabChange,
    formData,
    updateFormData,
    submitEmployeeData,
    isLoading,
    formError,
  };
}