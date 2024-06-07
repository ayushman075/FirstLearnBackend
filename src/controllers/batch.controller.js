import { Batch } from "../models/batch.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBatch = asyncHandler(async (req,res)=>{
const {batchId,batchname,description,isActive} = req.body;
    if(!batchId || !batchname){
        throw new ApiError(400,"Fields are required !!");
    }
    if(!req.user._id){
        throw new ApiError(400,"Unauthorised access !!");
    }

    const existedBatch = await User.findOne({batchId});

    if(existedBatch){
        throw new ApiError(409, "Batch with given batch id already exists !!")
      }

      const batch = await Batch.create({
        batchId,
        batchname,
        description,
        isActive,
        admin:req.user.email
        
      })

      return res.status(201).json(new ApiResponse(200,batch,"Batch created sucessfully"));
});

const updateBatch = asyncHandler(async (req,res)=>{
  const {batchId,batchname,description,isActive,faculty,classRepresentative,admin,attendance} = req.body;
  if(!batchId || !batchname || !admin){
    throw new ApiError(400,"Fields are required !!");
}

if(!req.user._id){
  throw new ApiError(400,"Unauthorised access !!");
}
const existedBatch = await User.findOne({batchId});

if(!existedBatch){
  throw new ApiError(400,"No Batch exists with provided Batch ID !!");
}

const batch = await Batch.findOneAndUpdate({batchId},{
  batchname:batchname?batchname:existedBatch.batchname,
  description:description?description:existedBatch.description,
  isActive:isActive?isActive:existedBatch.isActive,
  admin:admin?admin:existedBatch.admin,
  faculty:faculty?faculty:existedBatch.faculty,
  classRepresentative:classRepresentative?classRepresentative:existedBatch.classRepresentative,
  attendance:attendance?attendance:existedBatch.attendance
},
{new:true})


return res
.status(200)
.json(new ApiResponse(200, batch,"Batch details updated successfully !!"))

});

const getBatch = asyncHandler(async (req,res)=>{
  const {batchId} = req.body;
  if(!batchId){
    throw new ApiError(400,"Fields are required !!");
}

if(!req.user._id){
  throw new ApiError(400,"Unauthorised access !!");
}
const existedBatch = await User.findOne({batchId});

if(!existedBatch){
  throw new ApiError(400,"No Batch exists with provided Batch ID !!");
}

return res
.status(200)
.json(new ApiResponse(200, existedBatch,"Batch details updated successfully !!"))

});

const deleteBatch = asyncHandler(async (req,res)=>{
  const {batchId} = req.body;
  if(!batchId){
    throw new ApiError(400,"Fields are required !!");
}

if(!req.user._id){
  throw new ApiError(400,"Unauthorised access !!");
}
const existedBatch = await User.findOne({batchId});

if(!existedBatch){
  throw new ApiError(400,"No Batch exists with provided Batch ID !!");
}

if(!existedBatch.admin.contains(req.user.email)){
  throw new ApiError(400,"Unauthorised access, Only admins can delete a Batch !!");
}

const batch = await Batch.findOneAndDelete({batchId})
return res
.status(200)
.json(new ApiResponse(200, batch,"Batch deleted successfully !!"))
});

const getUniqueBatchId = asyncHandler(async (req,res)=>{
  if(!req.user._id){
    throw new ApiError(400,"Unauthorised access !!");
  }
    const uniqueCode = Math.floor(100000 + Math.random() * 900000);
    return res
.status(200)
.json(new ApiResponse(200, {uniqueBatchId:uniqueCode},"Generated unique Batch ID successfully !!"))

});



export {createBatch,updateBatch,getBatch,getUniqueBatchId,deleteBatch}