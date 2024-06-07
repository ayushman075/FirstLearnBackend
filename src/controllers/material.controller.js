import { Batch } from "../models/batch.model.js";
import { Material } from "../models/material.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const uploadMaterial = asyncHandler(async (req,res)=>{
    const {materialHeading,batchId,description,uploadedBy} = req.body;
        if(!batchId || !materialHeading || !uploadedBy){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id && req.user.email == uploadedBy){
            throw new ApiError(400,"Unauthorised access !!");
        }

        const batch = await User.findOne({batchId});

        if(!batch){
            throw new ApiError(400,"No Batch exists with given batch ID !!");
        }

        
    const checkUserStatus = await Batch.find({
        $or:[
           { admin:uploadedBy},
           {faculty:uploadedBy},
           {classRepresentative:uploadedBy}
        ]
    })

    if(!checkUserStatus){
        throw new ApiError(400,"You are not authorised to perform this action !!");
    }

    const materialLocalPath = req.file.path;
     var materialLink="";
     
    if(avatarLocalPath){
        materialLink= await uploadFileOnCloudinary(materialLocalPath);
    }

    const material = await Material.create({
        materialHeading,
        batchId,
        description,
        materialLink,
        uploadedBy       
        
    })

    return res
    .status(200)
    .json(new ApiResponse(200,material,"Material added sucessfully !!"));

    })


    const deleteMaterial = asyncHandler(async (req,res)=>{
        const {materialId,batchId} = req.body;
            if(!batchId || !materialId){
                throw new ApiError(400,"Fields are required !!");
            }
            if(!req.user._id ){
                throw new ApiError(400,"Unauthorised access !!");
            }
    
            const batch = await User.findOne({batchId});
    
            if(!batch){
                throw new ApiError(400,"No Batch exists with given batch ID !!");
            }
    
            const material = await User.findById(materialId);
    
            if(!material){
                throw new ApiError(400,"No material exists with given ID !!");
            }
            
        const checkUserStatus = await Batch.find({
            $or:[
               { admin:uploadedBy},
               {faculty:uploadedBy},
               {classRepresentative:uploadedBy}
            ]
        })
    
        if(!checkUserStatus){
            throw new ApiError(400,"You are not authorised to perform this action !!");
        }
    
       await Material.findByIdAndDelete(materialId);
    
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Material added sucessfully !!"));
    
        })



        const getMaterial = asyncHandler(async (req,res)=>{
            const {batchId} = req.body;
            if(!batchId){
                throw new ApiError(400,"Fields are required !!");
            }
            if(!req.user._id ){
                throw new ApiError(400,"Unauthorised access !!");
            }

            const material = await Material.findOne({batchId});

            return res
            .status(200)
            .json(new ApiResponse(200,material,"Successfully fetched material !!"))
        })

        export {uploadMaterial,deleteMaterial,getMaterial}