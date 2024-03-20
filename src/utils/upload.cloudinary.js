import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return "Local file path is missing";

        // upload file to the cloudinary

        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "chessUnity",
            resource_type: "auto",
        });

        //  file uplloaded successfully

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as upload operation faild

        return null;
    }
};

export { uploadOnCloudinary };
