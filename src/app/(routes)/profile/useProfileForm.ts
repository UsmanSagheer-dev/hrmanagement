"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import IMAGES from "@/app/assets/images";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const useProfileForm = () => {
  const router = useRouter();
  const { userData, isLoading, error, updateUser, fetchUserData } =
    useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", avatar: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      const updatedData = {
        name: userData.name || "",
        role: userData.role || "",
        avatar: userData.avatar || "",
      };
      setFormData(updatedData);
      setPreviewImage(userData.avatar || IMAGES.Profileimg.src);
    }
  }, [userData]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size should be less than 1MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      setFormData((prev) => ({ ...prev, avatar: base64String }));
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      const updates: Record<string, any> = {};
      if (formData.name !== userData?.name) updates.name = formData.name;
      if (previewImage !== userData?.avatar && formData.avatar)
        updates.avatar = formData.avatar;
      if (userData?.role === "Admin" && formData.role !== userData.role)
        updates.role = formData.role;

      if (Object.keys(updates).length > 0) {
        const updatedData = await updateUser(updates);
        setFormData({
          name: updatedData.name,
          role: updatedData.role,
          avatar: updatedData.avatar,
        });
        setPreviewImage(updatedData.avatar || IMAGES.Profileimg.src);
        toast.success("Profile updated successfully");

        if (updatedData.role === "Employee") {
          router.push("/viewemployeedetail");
        } else if (updatedData.role === "Admin") {
          router.push("/dashboard");
        }
      } else {
        toast.error("No changes detected");
      }

      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        role: userData.role || "",
        avatar: userData.avatar || "",
      });
      setPreviewImage(userData.avatar || IMAGES.Profileimg.src);
    }
    setIsEditing(false);
  };

  return {
    userData,
    isLoading,
    error,
    isEditing,
    formData,
    previewImage,
    isSubmitting,
    setIsEditing,
    handleInputChange,
    handleFileChange,
    handleSave,
    handleCancel,
    fetchUserData,
  };
};
