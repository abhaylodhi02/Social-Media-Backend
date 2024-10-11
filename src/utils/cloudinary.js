import {v2 as cloudinary}  from "cloudinary";
import fs from "fs";

//fs = file system and file handling
// deleet file = unlink


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
                            resource_type: "auto"
                        })
        
        //file uploaded successfully
        console.log("file is uploaded on cloudinary: ",response.url);
        return response;

    }catch(error){
        fs.unlinkSync(localFilePath) // remove locally saved temp file if operation is failed
        return null;
    }
}


export {uploadOnCloudinary};