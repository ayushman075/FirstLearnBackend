import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js';
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async  (userId) => {
  try {
   const user =  await User.findById(userId)
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()

  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})

  return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refresh token !!")
  }
}


const registerUser = asyncHandler(
    async (req,res)=>{
         // get user details from request
        // validation
        // check if user already exist -> email
        // check for images -> upload to cloudnairy
        // create user object -> create entry in DB
        // remove password and refresh token field from response
        // check for user creation
        // return res

       const {username,usertype,rollno,institute,email,password} =req.body


      if([username,usertype,rollno,institute,email,password].some((field)=>{
        return field===""||field===undefined
      })){
        throw new ApiError(400,"Some fields are empty!!")
      }
    

     const existedUser = await User.findOne({email:email})
      if(existedUser){
        throw new ApiError(409, "User with email already exists !!")
      }

     const avatarLocalPath = req.file.path;
     var avatar="";
     
    if(avatarLocalPath){
      avatar= await uploadFileOnCloudinary(avatarLocalPath);
    }

    const user = await User.create({
        username:username,
        email:email?.toLowerCase(),
        avatar:avatar,
        usertype:usertype,
        rollno:rollno,
        institute:institute,
        password:password,
        
    })

    const checkUser = await User.findById(user._id).select("-password -refreshToken");

    if(!checkUser){
        throw new ApiError(500, "Something went wrong while registring user !!")
    }

    return res.status(201).json(new ApiResponse(200,checkUser,"User created sucessfully"))

    }
)


const loginUser=asyncHandler(async (req,res)=>{
// req -> body data
//username
//find the user
//password check
//access and refresh token
//send cookies

const {email,password}=req.body
if(email=="" || email==undefined || !email){
      throw new ApiError(400,"Email is required !!")
}
else if(password=="" || password==undefined || !password){
      throw new ApiError(400,"Password is required !!")
}

const user = await User.findOne({"email":email})

if(!user){
  throw new ApiError(404,"User doesn't exist !!")
}
const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
  throw new ApiResponse(401,"Invalid user credentials !!")
}
const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).
                      select("-password -refreshToken")

                      const options={
                        httpOnly:true,
                        secure:true
                      }

                      return res
                      .status(200)
                      .cookie("accessToken",accessToken,options)
                      .cookie("refreshToken",refreshToken,options)
                      .json(
                        new ApiResponse(
                          200,
                          {
                            user:loggedInUser,accessToken,refreshToken
                          },
                          "User logged in sucessfully !!"
                        )
                      )

})


const logoutUser=asyncHandler(async(req,res)=>{
const loggedOutUser= await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      },
      
    },
    {
      new : true
    }
  ) 

  const options={
    httpOnly:true,
    secure:true
  }


  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out !!"))
})



const refreshAccessToken = asyncHandler(async (req,res)=>{
  try {
    const incomingRefreshToken =req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
      throw new ApiError(401,"Unautorized request !!")
    }
  
    const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN)
  
    const user= await User.findById(decodedToken?._id);
  
    if(!user){
      throw new ApiError(401,"Invalid Refresh token !!")
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used");
    }
  
    const options ={
      httpOnly:true,
      secure:true
    }
  
  
   const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
  
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken:newRefreshToken},
      "Access token refreshed"
    )
   )
  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token !!")
  }


})
 

const changeCurrentPassword = asyncHandler(async (req,res)=>{
  const {oldPassword,newPassword}=req.body;

  const user =  await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  user.password =newPassword;
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Password changed successfully !!")
  )
})

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res.status(200)
  .json(new ApiResponse(200,req.user,"Current user fetched successfully !!"))
})


const updateUserDetails = asyncHandler(async(req,res)=>{
  const {email,usertype,username,rollno,institute}=req.body

  if(!email){
    throw new ApiError(400,"All fields are required !!")
  }
 if(email!=req.user.email){
  throw new ApiError(400,"Unautorized access !!")
 }
  const user = await User.findByIdAndUpdate(
    req.user._id,
      {
        usertype:usertype?usertype:req.user.usertype,
        username:username?username:req.user.username,
        rollno:rollno?rollno:req.user.rollno,
        institute:institute?institute:req.user.institute
        },
    {new:true}
  ).select("-password")

  return res
        .status(200)
        .json(new ApiResponse(200, user,"Account details updated successfully !!"))
  
})

const updateAvatar =  asyncHandler(async (req,res)=>{
      const avatarLocalPath = req.file?.path;

      if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing !!");
      }

      const avatar = await uploadFileOnCloudinary(avatarLocalPath)
      if(!avatar){
        throw new ApiError(400,"Error while uploading avatar !!")
      }

     const updatedUser= await User.findByIdAndUpdate(
        req.user?._id,
        {
          $set:{
            avatar:avatar
          }
        },
        {
          new:true
        }
      ).select("-password")

      return res
      .status(200)
      .json(new ApiResponse(200,updatedUser,"Avatar updated sucessfully !!"))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateUserDetails,updateAvatar}