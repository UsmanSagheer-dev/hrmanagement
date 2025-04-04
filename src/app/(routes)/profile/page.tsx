"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import IMAGES from "@/app/assets/images";
import InputField from "@/app/components/inputField/InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { uploadImageToCloudinary } from "@/app/utils/cloudinary";

const ProfilePage: React.FC = () => {
  const { userData, isLoading, error, updateUser, fetchUserData } = useUserProfile();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        role: userData.role || "",
        avatar: userData.avatar || "",
      });
      setPreviewImage(userData.avatar || IMAGES.Profileimg.src);
    }
  }, [userData]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    try {
      toast.loading("Uploading image...");
      const imageUrl = await uploadImageToCloudinary(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      toast.dismiss();
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload image");
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      const updatedData = await updateUser({
        name: formData.name,
        avatar: formData.avatar,
        ...(userData?.role === "Admin" && formData.role !== userData.role 
            ? { role: formData.role } 
            : {})
      });
      
      setFormData({
        name: updatedData.name,
        role: updatedData.role,
        avatar: updatedData.avatar,
      });
      setPreviewImage(updatedData.avatar || IMAGES.Profileimg.src);
      setIsEditing(false);
      toast.success("Profile updated successfully");
      router.push("/dashboard");
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

  if (isLoading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Error: {error || "No user data available"}
        <button
          onClick={() => fetchUserData()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
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
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4 flex justify-center relative">
                <motion.img
                  key={previewImage}
                  src={previewImage}
                  alt="Profile avatar"
                  className="w-[120px] h-[120px] rounded-full shadow-lg object-cover"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => (e.currentTarget.src = IMAGES.Profileimg.src)}
                />
                <label className="absolute bottom-2 bg-white/80 px-2 py-1 rounded-md text-sm text-gray-700 shadow-md cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
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
                disabled={userData.role !== "Admin"}
              />
              <div className="flex space-x-2 justify-center">
                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="bg-gray-400 px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <>
              <motion.img
                key={previewImage}
                src={previewImage}
                alt="Profile avatar"
                className="w-[120px] h-[120px] rounded-full mb-4 shadow-lg object-cover"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => (e.currentTarget.src = IMAGES.Profileimg.src)}
              />
              <h2 className="text-xl font-semibold mb-2 text-white">
                {formData.name}
              </h2>
              <p className="text-gray-400 mb-4">{formData.role}</p>
              <motion.button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit Profile
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;