import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOULINARY_API_KEY , 
        api_secret: process.env.CLOULINARY_SECRET_KEY
    })

    const uploadFileOnCloudinary=async(localFilePath)=>{
try {
    if(!localFilePath) return null;
    //upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
    //dev temp start
console.log("File uploaded on cloudinary ",response.url)
      //dev temp end

      return response;
} catch (error) {
     //dev temp start
     console.log("Error occurred while uploading file "+error)
      //dev temp end
    fs.unlinkSync(localFilePath)
    return null;
}
    }


    export {uploadFileOnCloudinary}