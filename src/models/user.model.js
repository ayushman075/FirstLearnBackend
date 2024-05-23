import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
username:{
    type:String,
    required:true,
    trim:true,
    index:true
},
email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    lowercase:true,
    index:true
},
avatar:{
    type:String,
   
},
usertype:{
    type:String,
    required:true,
    enum:["Faculty","Student","Class Representative","Guest","Admin"]
},
rollno:{
    type:Number,
    required:true,
},
institute:{
    type:String,
    required:true
},
isPremiumUser:{
    type:Boolean
},
batches:{
    type:Array,
    default:[]
},
password:{
    type:String,
    required:[true,"Password is required"]
},
refreshToken:{
    type:String
},
accessToken:{
    type:String
}


},
{
    timestamps:true
}
)

userSchema.pre('save', async function (next) {
    if(this.isModified("password")){
 this.password=await bcrypt.hash(this.password,10);
}
 next();
})

userSchema.methods.isPasswordCorrect=async function (password){
return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= async function(){
  return await jwt.sign(
        {
            _id:this._id,
            email:this.email
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken= async function(){
    return await jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)