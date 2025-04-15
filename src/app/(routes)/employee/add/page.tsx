"use client";
import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import Header from "@/app/components/header/Header";
import { EmployeeFormProvider } from "@/app/contexts/EmployeeFormContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/components/loader/Loader";
import { useEmployeeForm } from "./useEmployeeForm";

function EmployeeFormContent() {
  const { userRole, loading, error, renderContent, showHeaderAndSidebar } =
    useEmployeeForm();

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