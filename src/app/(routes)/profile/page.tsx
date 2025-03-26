"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import IMAGES from "@/app/assets/images";
import InputField from "@/app/components/inputField/InputField";
import { useAdmin } from "@/app/hooks/useAdmin";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { adminData, isLoading, error, updateAdmin } = useAdmin();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name,
        role: adminData.role,
        avatar: adminData.avatar || "",
      });
      setPreviewImage(adminData.avatar || IMAGES.Profileimg.src);
    }
  }, [adminData]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (files: FileList) => {
    const file = files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateAdmin({
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (adminData) {
      setFormData({
        name: adminData.name,
        role: adminData.role,
        avatar: adminData.avatar || "",
      });
      setPreviewImage(adminData.avatar || IMAGES.Profileimg.src);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="text-white min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-white min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-lg shadow-xl w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          User Profile
        </h1>

        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isEditing ? (
            <form className="w-full">
              <div className="mb-4 flex justify-center relative">
                <motion.img
                  src={previewImage}
                  alt="Profile avatar"
                  className="w-[120px] h-[120px] rounded-full shadow-lg object-cover"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <label className="absolute bottom-2 bg-white/80 px-2 py-1 rounded-md text-sm text-gray-700 shadow-md cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                  />
                </label>
              </div>

              <InputField
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                className="mb-4 text-white"
              />
              <InputField
                label="Role"
                type="text"
                value={formData.role}
                onChange={handleInputChange("role")}
                className="mb-4 text-white"
              />

              <div className="flex space-x-2 justify-center">
                <motion.button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                  Save
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <>
              <motion.img
                src={previewImage}
                alt="Profile avatar"
                className="w-[120px] h-[120px] rounded-full mb-4 shadow-lg object-cover"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <h2 className="text-xl font-semibold mb-2 text-white">
                {formData.name}
              </h2>
              <p className="text-gray-400 mb-4">{formData.role}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
              >
                Edit Profile
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;