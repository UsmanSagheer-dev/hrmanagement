"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useEmployeeForm } from "../hooks/useEmployeeForm";

const EmployeeFormContext = createContext<ReturnType<typeof useEmployeeForm> | undefined>(undefined);

export const EmployeeFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const employeeFormValues = useEmployeeForm();
  return (
    <EmployeeFormContext.Provider value={employeeFormValues}>
      {children}
    </EmployeeFormContext.Provider>
  );
};

export const useEmployeeFormContext = () => {
  const context = useContext(EmployeeFormContext);
  if (context === undefined) {
    throw new Error("useEmployeeFormContext must be used within an EmployeeFormProvider");
  }
  return context;
};