"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import Header from "@/app/components/header/Header";
import PersonalInformationForm from "@/app/(form)/personalInformationForm/PersonalInformationForm";
import ProfessionalInformationForm from "@/app/(form)/professionalInformationForm/ProfessionalInformationForm";
import DocumentsForm from "@/app/(form)/documentsForm/DocumentsForm";
import AccountAccessForm from "@/app/(form)/accountAccessForm/AccountAccessForm";
import {
  EmployeeFormProvider,
  useEmployeeFormContext,
} from "@/app/contexts/EmployeeFormContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/components/loader/Loader";
import toast from "react-hot-toast";

function EmployeeFormContent() {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const showHeaderAndSidebar = userRole === "Employee" || userRole === "Admin";

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        {showHeaderAndSidebar && (
          <div>
            <Sidebar />
          </div>
        )}
        <div className="w-full flex flex-col gap-4">
          {showHeaderAndSidebar && (
            <div className="w-full">
              <Header
                title="All Employees"
                description="All Employee > Add New Employee"
              />
            </div>
          )}
          <div className="">{renderContent()}</div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

function EmployeeFormPage() {
  return (
    <EmployeeFormProvider>
      <EmployeeFormContent />
    </EmployeeFormProvider>
  );
}

export default EmployeeFormPage;
