import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscribeScheme=new Schema(
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
        role:{
            type:String,
            required:true,
            enum:["Faculty","Student","Class Representative","Guest","Admin"]
        },
        batchId:{
            type:Number,
            required:true
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        lastOpenedOn:{
            type:Date,
            default:new Date.now()
        }
    },
    {
        timestamps:true
    }
)

subscribeScheme.plugin(mongooseAggregatePaginate)

export const Subscribe = mongoose.model("Subscribe",subscribeScheme)
