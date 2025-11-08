import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/**
 
 * @param fileData 
 * @returns 
 */
export const uploadToCloudinary = async (fileData: string): Promise<string> => {
  if (fileData.startsWith("http") && fileData.includes("cloudinary.com")) {
    return fileData;
  }

  try {
    const isImage = fileData.startsWith("data:image");
    const isPDF = fileData.startsWith("data:application/pdf");

    if (!isImage && !isPDF) {
      throw new Error(
        "Unsupported file format. Only images and PDFs are allowed."
      );
    }

    const uploadOptions: {
      folder: string;
      resource_type: "image" | "raw"; // Explicitly typed to match Cloudinary's UploadApiOptions
      public_id: string;
      quality?: string;
    } = {
      folder: "user_documents",
      resource_type: isPDF ? "raw" : "image", // Explicitly typed
      public_id: `${Date.now()}`,
      ...(isImage && { quality: "auto" }),
    };

    const result = await cloudinary.uploader.upload(fileData, uploadOptions);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

/**
 * @param url
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  if (!url || !url.includes("cloudinary.com")) {
    console.log("Not a valid Cloudinary URL:", url);
    return;
  }

  try {
    const urlParts = url.split("/");
    const folderIndex = urlParts.indexOf("user_documents");

    if (folderIndex === -1) {
      console.log("Not a user document URL:", url);
      return;
    }

    const publicIdWithExtension = urlParts.slice(folderIndex).join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    const resourceType = url.endsWith(".pdf") ? "raw" : "image";

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
