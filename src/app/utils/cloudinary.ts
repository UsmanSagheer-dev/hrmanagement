export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
  formData.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
