import { useState, useEffect } from "react";
import { useEmployeeFormContext } from "../../contexts/EmployeeFormContext";
import { PersonalInformationFormProps, FormData } from "../../types/formTypes";

export const usePersonalInformationForm = ({
  onTabChange,
}: PersonalInformationFormProps) => {
  const { formData, updateFormData } = useEmployeeFormContext();
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [localFormData, setLocalFormData] = useState<FormData["personal"]>(
    formData.personal
  );

  useEffect(() => {
    setLocalFormData(formData.personal);
    if (formData.personal.profileImage) {
      if (formData.personal.profileImage instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfileImagePreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(formData.personal.profileImage);
      } else if (typeof formData.personal.profileImage === "string") {
        setProfileImagePreview(formData.personal.profileImage);
      }
    } else {
      setProfileImagePreview(null);
    }
  }, [formData.personal]);

  const handleInputChange = (field: string, value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    updateFormData("personal", { [field]: value });
  };

  const handleImageChange = (files: FileList) => {
    const file = files[0];
    updateFormData("personal", { profileImage: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData("personal", localFormData);
    onTabChange("professional");
  };

  const handleCancel = () => {
    const resetData = {
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
    };
    setLocalFormData(resetData);
    updateFormData("personal", resetData);
    setProfileImagePreview(null);
  };

  return {
    localFormData,
    profileImagePreview,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleCancel,
  };
};
