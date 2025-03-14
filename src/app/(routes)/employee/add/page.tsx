"use client";
import AccountAccessForm from "@/app/(form)/accountAccessForm/AccountAccessForm";
import Sidebar from "@/app/components/sidebar/Sidebar";
import Header from "@/app/header/Header";
import PersonalInformationForm from "@/app/(form)/personalInformationForm/PersonalInformationForm";
import ProfessionalInformationForm from "@/app/(form)/professionalInformationForm/ProfessionalInformationForm";
import React, { useState } from "react";
import Document from "next/document";
import DocumentsTab from "@/app/(form)/documentsForm/DocumentsForm";
import DocumentsForm from "@/app/(form)/documentsForm/DocumentsForm";
function Page() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInformationForm onTabChange={setActiveTab} />;
      case "professional":
        return <ProfessionalInformationForm onTabChange={setActiveTab} />;
      case "documents":
        return <DocumentsForm onTabChange={setActiveTab} />;
      case "account":
        return <AccountAccessForm onTabChange={setActiveTab} />;
      default:
        return <PersonalInformationForm onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full ">
            <Header
              title="All Employees"
              description="All Employee > Add New Employee"
            />
          </div>
          <div className="">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
