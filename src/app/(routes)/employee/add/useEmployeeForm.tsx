"use client";
import { useState, useEffect } from "react";
import { useEmployeeFormContext } from "@/app/contexts/EmployeeFormContext";
import toast from "react-hot-toast";
import PersonalInformationForm from "@/app/(form)/personalInformationForm/PersonalInformationForm";
import ProfessionalInformationForm from "@/app/(form)/professionalInformationForm/ProfessionalInformationForm";
import DocumentsForm from "@/app/(form)/documentsForm/DocumentsForm";
import AccountAccessForm from "@/app/(form)/accountAccessForm/AccountAccessForm";
import { UseEmployeeFormReturn } from "@/app/types/formTypes";

export const useEmployeeForm = (): UseEmployeeFormReturn => {
  const { activeTab, handleTabChange } = useEmployeeFormContext();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserRole(data.role);
      } catch (err) {
        toast.error("Could not load user profile");
        setError("Could not load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInformationForm onTabChange={handleTabChange} />;
      case "professional":
        return <ProfessionalInformationForm onTabChange={handleTabChange} />;
      case "documents":
        return <DocumentsForm onTabChange={handleTabChange} />;
      case "account":
        return <AccountAccessForm onTabChange={handleTabChange} />;
      default:
        return <PersonalInformationForm onTabChange={handleTabChange} />;
    }
  };

  const showHeaderAndSidebar = userRole === "Employee" || userRole === "Admin";

  return {
    userRole,
    loading,
    error,
    renderContent,
    showHeaderAndSidebar,
  };
};
