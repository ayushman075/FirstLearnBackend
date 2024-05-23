import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js';
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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
        password:password

    })

    const checkUser = await User.findById(user._id).select("-password -refreshToken");

    if(!checkUser){
        throw new ApiError(500, "Something went wrong while registring user !!")
    }

    return res.status(201).json(new ApiResponse(200,checkUser,"User created sucessfully"))

    }
)


export {registerUser}