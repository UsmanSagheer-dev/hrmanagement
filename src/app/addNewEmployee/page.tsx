"use client";
import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../header/Header";
import PersonalInformationForm from "../personalInformationForm/PersonalInformationForm";
import ProfessionalInformationForm from "../professionalInformationForm/ProfessionalInformationForm";
import DocumentsForm from "../documentsForm/DocumentsForm";
import AccountAccessForm from "../accountAccessForm/AccountAccessForm";

function AddNewEmployee() {
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

export default AddNewEmployee;
