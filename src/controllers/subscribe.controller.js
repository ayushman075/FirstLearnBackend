//Join Batch
//Leave Batch
//set verified
//set not verified
//get all members of batch
//get all students

import { Subscribe } from "../models/subscribe.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const joinBatch = asyncHandler(async (req,res)=>{
    const {batchId,email,username,role} = req.body;
        if(!batchId || !email || !username || !role){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id){
            throw new ApiError(400,"Unauthorised access !!");
        }
    
        const existedBatch = await User.findOne({batchId});
    
        if(!existedBatch){
            throw new ApiError(409, "Batch with given batch id already exists !!")
          }
    
          const subscribe = await Subscribe.create({
           username,
           email,
           role,
           batchId,
           isVerified:false,
           lastOpenedOn:new Date.now()            
          })
    
          return res.status(201).json(new ApiResponse(200,subscribe,"Bank joined sucessfully !!"));
    });

    const leaveBatch = asyncHandler(async (req,res)=>{
        const {batchId,email} = req.body;
        if(!batchId || !email){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id && email!=req.user.email){
            throw new ApiError(400,"Unauthorised access !!");
        }
    
        const record= await Subscribe.findOne({email:email,batchId:batchId});

        if(!record){
            throw new ApiError(400,"Unable to find any such record !!");
        }
        const deleteRecord=await Subscribe.findByIdAndDelete(record._id);

        return res
        .status(200)
        .json(new ApiResponse(200,{},"Leaved batch successfully !!"))
    })


    const setVerified = asyncHandler(async (req,res)=>{
        const {batchId,email,userEmail} = req.body;
        if(!batchId || !email || !userEmail){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id && userEmail!=req.user.email){
            throw new ApiError(400,"Unauthorised access !!");
        }
    
        const checkUserStatus = await Batch.find({
            $or:[
               { admin:userEmail},
               {faculty:userEmail},
               {classRepresentative:userEmail}
            ]
        })

        if(!checkUserStatus){
            throw new ApiError(400,"Only Admins, Faculty and CRs can toggle verification !!");
        }
        const updatedRecord = await Subscribe.findOneAndUpdate({
            batchId,
            email
        },{
            $set: { isVerified:true }
        },{new:true})


        return res
        .status(200)
        .json(new ApiResponse(200,updatedRecord,"User Verified sucessfully !!"))

    })


    
    const notVerified = asyncHandler(async (req,res)=>{
        const {batchId,email,userEmail} = req.body;
        if(!batchId || !email || !userEmail){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id && userEmail!=req.user.email){
            throw new ApiError(400,"Unauthorised access !!");
        }
    
        const checkUserStatus = await Batch.find({
            $or:[
               { admin:userEmail},
               {faculty:userEmail},
               {classRepresentative:userEmail}
            ]
        })

        if(!checkUserStatus){
            throw new ApiError(400,"Only Admins, Faculty and CRs can toggle verification !!");
        }
        const updatedRecord = await Subscribe.findOneAndUpdate({
            batchId,
            email
        },{
            $set: { isVerified:false }
        },{new:true})


        return res
        .status(200)
        .json(new ApiResponse(200,updatedRecord,"User Verified sucessfully !!"))

    })


        
    const getAllMembers = asyncHandler(async (req,res)=>{
        const {batchId} = req.body;
        if(!batchId ){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id ){
            throw new ApiError(400,"Unauthorised access !!");
        }

        const members = await Subscribe.find({batchId});

        return res
        .status(200)
        .json(new ApiResponse(200,members,"Fetched all members successfuly !!"))

    })

    const getAllStudents = asyncHandler(async (req,res)=>{
        const {batchId} = req.body;
        if(!batchId ){
            throw new ApiError(400,"Fields are required !!");
        }
        if(!req.user._id ){
            throw new ApiError(400,"Unauthorised access !!");
        }

        const members = await Subscribe.find({batchId,role:['Student','Class Representative']});

        return res
        .status(200)
        .json(new ApiResponse(200,members,"Fetched all students successfuly !!"))

    })


    export {joinBatch,leaveBatch,setVerified,notVerified,getAllMembers,getAllStudents}