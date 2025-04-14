"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormData } from "../types/formTypes";

export function useEmployeeForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

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
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const submitEmployeeData = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setSubmissionStatus("pending");

      const profileImageBase64 = formData.personal.profileImage
        ? await fileToBase64(formData.personal.profileImage)
        : null;

      const documentBase64: Record<string, string | null> = {};
      const documentFields = [
        "appointmentLetter",
        "salarySlips",
        "relievingLetter",
        "experienceLetter",
      ];

      await Promise.all(
        documentFields.map(async (field) => {
          const file =
            formData.documents[field as keyof typeof formData.documents];
          documentBase64[field] = file ? await fileToBase64(file) : null;
        })
      );

      const employeeData = {
        firstName: formData.personal.firstName,
        lastName: formData.personal.lastName,
        mobileNumber: formData.personal.mobileNumber,
        email: formData.personal.email,
        dateOfBirth: formData.personal.dateOfBirth,
        maritalStatus: formData.personal.maritalStatus,
        gender: formData.personal.gender,
        nationality: formData.personal.nationality,
        address: formData.personal.address,
        city: formData.personal.city,
        state: formData.personal.state,
        zipCode: formData.personal.zipCode,
        profileImage: profileImageBase64,

        employeeId: formData.professional.employeeId,
        userName: formData.professional.userName,
        employeeType: formData.professional.employeeType,
        workEmail: formData.professional.workEmail || formData.personal.email,
        department: formData.professional.department,
        designation: formData.professional.designation,
        workingDays: formData.professional.workingDays,
        joiningDate: formData.professional.joiningDate,
        officeLocation: formData.professional.officeLocation,

        documents: documentBase64,

        slackId: formData.account.slackId,
        skypeId: formData.account.skypeId,
        githubId: formData.account.githubId,
      };

      const response = await fetch("/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Failed to save employee data";

        if (response.status === 409 && result.field) {
          let fieldName = "";
          switch (result.field) {
            case "employeeId":
              fieldName = "Employee ID";
              break;
            case "email":
              fieldName = "Email address";
              break;
            case "workEmail":
              fieldName = "Work email";
              break;
            default:
              fieldName = result.field;
          }
          throw new Error(`${fieldName} already exists in the system.`);
        }

        throw new Error(errorMessage);
      }

      setSubmissionStatus("success");

      if (result.pendingApproval) {
        toast.info(
          "Your employee registration has been submitted and is pending admin approval"
        );
      } else {
        toast.success("Employee data and documents successfully saved!");
      }

      if (result.pendingApproval) {
        router.push("/pending-approval");
      } else {
        router.push("/viewemployeedetail");
      }
    } catch (error: any) {
      toast.error("Error submitting employee data:", error);
      setFormError(
        error.message || "An error occurred while saving the employee data"
      );
      toast.error(error.message || "Failed to save employee data");
      setSubmissionStatus("error");
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
    submissionStatus,
  };
}
