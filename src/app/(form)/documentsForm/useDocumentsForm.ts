import { useEmployeeFormContext } from "@/app/contexts/EmployeeFormContext";
import { useEffect, useState } from "react";

const useDocumentsForm = () => {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setUploadedFiles(formData.documents || {});
  }, []);

  const handleFileUpload = (file: File, id: string) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }));

    setUploadedFiles((prev) => ({ ...prev, [id]: file }));

    updateFormData("documents", {
      ...formData.documents,
      [id]: file,
    });

    setTimeout(() => {
      setIsLoading((prev) => ({ ...prev, [id]: false }));
    }, 500);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    updateFormData("documents", {
      ...formData.documents,
      [id]: null,
    });
  };

  const handleCancel = (onTabChange: (tab: string) => void) => {
    setUploadedFiles({});
    updateFormData("documents", {
      appointmentLetter: null,
      salarySlips: null,
      relievingLetter: null,
      experienceLetter: null,
    });
    onTabChange("professional");
  };

  const handleNext = (onTabChange: (tab: string) => void) => {
    updateFormData("documents", uploadedFiles);
    onTabChange("account");
  };

  return {
    uploadedFiles,
    isLoading,
    handleFileUpload,
    handleRemoveFile,
    handleCancel,
    handleNext,
  };
};

export default useDocumentsForm;
