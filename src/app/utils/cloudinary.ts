import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param fileData Base64 encoded file data
 * @returns URL of the uploaded file
 */
export const uploadToCloudinary = async (fileData: string): Promise<string> => {
  // If already a Cloudinary URL, return as is
  if (fileData.startsWith("http") && fileData.includes("cloudinary.com")) {
    return fileData;
  }

  try {
    // Check file type
    const isImage = fileData.startsWith("data:image");
    const isPDF = fileData.startsWith("data:application/pdf");

    if (!isImage && !isPDF) {
      throw new Error("Unsupported file format. Only images and PDFs are allowed.");
    }

    // Set upload options based on file type
    const uploadOptions = {
      folder: "user_documents",
      resource_type: isPDF ? "raw" : "image",
      // Add a timestamp to avoid file name collisions
      public_id: `${Date.now()}`,
      // Set quality compression for images
      ...(isImage && { quality: "auto" }),
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileData, uploadOptions);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

/**
 * Deletes a file from Cloudinary
 * @param url Cloudinary URL of the file to delete
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  if (!url || !url.includes("cloudinary.com")) {
    console.log("Not a valid Cloudinary URL:", url);
    return;
  }

  try {
    // Extract public_id from URL
    const urlParts = url.split("/");
    const folderIndex = urlParts.indexOf("user_documents");
    
    if (folderIndex === -1) {
      console.log("Not a user document URL:", url);
      return;
    }
    
    const publicIdWithExtension = urlParts.slice(folderIndex).join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    // Determine resource type from URL
    const resourceType = url.endsWith(".pdf") ? "raw" : "image";

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok") {
      console.warn(`File deletion warning: ${result.result}`);
    } else {
      console.log(`File ${publicId} deleted from Cloudinary`);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

export default cloudinary;