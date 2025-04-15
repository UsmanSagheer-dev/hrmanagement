import { useState, useEffect } from "react";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";

export function useAccountAccessForm() {
  const { formData, updateFormData, submitEmployeeData, isLoading, formError } =
    useEmployeeFormContext();

  const [localFormData, setLocalFormData] = useState(formData.account);

  useEffect(() => {
    setLocalFormData(formData.account);
  }, [formData.account]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }));
    updateFormData("account", { [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("account", localFormData);
    await submitEmployeeData();
  };

  const handleCancel = () => {
    const resetData = {
      emailAddress: "",
      slackId: "",
      skypeId: "",
      githubId: "",
    };
    setLocalFormData(resetData);
    updateFormData("account", resetData);
  };

  const INPUT_FIELDS = [
    { type: "email", placeholder: "Email Address", field: "emailAddress" },
    { type: "text", placeholder: "Slack ID", field: "slackId" },
    { type: "text", placeholder: "Skype ID", field: "skypeId" },
    { type: "text", placeholder: "Github ID", field: "githubId" },
  ];

  return {
    localFormData,
    isLoading,
    formError,
    INPUT_FIELDS,
    handleInputChange,
    handleSubmit,
    handleCancel,
  };
}
