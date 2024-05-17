import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from jsonwebtoken;
import bcrypt from bcrypt;

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
    required:true
},
usertype:{
    type:String,
    required:true,
    enum:["Faculty","Student","Class Representative","Guest"]
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
    type:Schema.Types.ObjectId,
    ref:"Batch"
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
    if(this.isModified("pasword")){
 this.password=await bcrypt.hash(this.password,10);
}
 next();
})

userSchema.methods.isPasswordCorrect=async function (password){
return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
  return jwt.sign(
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
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
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