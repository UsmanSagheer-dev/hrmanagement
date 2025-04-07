import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @param imageData
 * @returns
 */
export const uploadToCloudinary = async (
  imageData: string
): Promise<string> => {
  if (imageData.startsWith("http") && imageData.includes("cloudinary.com")) {
    return imageData;
  }

  try {
    if (imageData.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: "user_profiles",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      });

      console.log("Image uploaded to Cloudinary:", {
        public_id: result.public_id,
        secure_url: result.secure_url,
      });

      return result.secure_url;
    } else {
      throw new Error("Invalid image format");
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

/**
 * @param url
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  try {
    const urlParts = url.split("/");
    const publicIdWithExtension = urlParts
      .slice(urlParts.indexOf("user_profiles"))
      .join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
    console.log(`Image ${publicId} deleted from Cloudinary`);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

export default cloudinary;
