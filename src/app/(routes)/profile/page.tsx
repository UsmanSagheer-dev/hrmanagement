"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import IMAGES from "@/app/assets/images";
import InputField from "@/app/components/inputField/InputField";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    role: "Developer",
    image: IMAGES.Profileimg.src,
  });
  const [previewImage, setPreviewImage] = useState(formData.image);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (files: FileList) => {
    const file = files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        name: "John Doe",
        role: "Developer",
        image: IMAGES.Profileimg.src,
      });
      setPreviewImage(IMAGES.Profileimg.src);
    }
  };

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
                  className="w-[120px] h-[120px] rounded-full shadow-lg"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute bottom-2 bg-white/80 px-2 py-1 rounded-md text-sm text-gray-700 shadow-md">
                  Change Image
                </div>
              </div>

              <InputField
                type="file"
                value=""
                onChange={() => {}}
                onFileChange={handleFileChange}
                accept="image/*"
                className="mb-4 text-white border-gray-300"
              />
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-gray-400 px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <>
              <motion.img
                src={formData.image}
                alt="Profile avatar"
                className="w-[120px] h-[120px] rounded-full mb-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <h2 className="text-xl font-semibold mb-2 text-white">
                {formData.name}
              </h2>
              <p className="text-gray-400 mb-4">{formData.role}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditToggle}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
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
