"use client";
import React from "react";
import { motion } from "framer-motion";
import InputField from "@/app/components/inputField/InputField";
import IMAGES from "@/app/assets/images";
import { useProfileForm } from "./useProfileForm";


const ProfilePage: React.FC = () => {
  const {
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
  } = useProfileForm();

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
          onClick={fetchUserData}
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
                <motion.div
                  className="relative w-[120px] h-[120px] rounded-full shadow-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={previewImage}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = IMAGES.Profileimg.src;
                    }}
                  />
                </motion.div>
                <label className="absolute bottom-2 bg-white/80 px-2 py-1 rounded-md text-sm text-gray-700 shadow-md cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
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
              <motion.div
                className="relative w-[120px] h-[120px] rounded-full mb-4 shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={previewImage}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = IMAGES.Profileimg.src;
                  }}
                />
              </motion.div>
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
