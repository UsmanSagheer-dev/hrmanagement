import { useState, useEffect } from "react";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";
import { 
  employeeTypeOptions, 
  departmentOptions, 
  workingDaysOptions, 
  officeLocationOptions 
} from "../../constants/formConstants";

export function useProfessionalInformationForm(onTabChange: (tab: string) => void) {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [localFormData, setLocalFormData] = useState(formData.professional);

  useEffect(() => {
    setLocalFormData(formData.professional);
  }, [formData.professional]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    updateFormData("professional", { [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("professional", localFormData);
    onTabChange("documents");
  };

  const handleCancel = () => {
    const resetData = {
      employeeId: "",
      userName: "",
      employeeType: "",
      workEmail: "",
      department: "",
      designation: "",
      workingDays: "",
      joiningDate: "",
      officeLocation: "",
    };
    setLocalFormData(resetData);
    updateFormData("professional", resetData);
  };

  const formOptions = {
    employeeTypeOptions,
    departmentOptions,
    workingDaysOptions,
    officeLocationOptions
  };

  return {
    localFormData,
    formOptions,
    handleInputChange,
    handleSubmit,
    handleCancel
  };
}