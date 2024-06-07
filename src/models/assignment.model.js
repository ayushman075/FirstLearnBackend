import { ObjectId } from "mongodb";
import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const assignmentSchema = new Schema(
    {
            assignmentHeading:{
                type:String,
                required:true
            },
            batchId:{
                type:Number,
                unique:true,
                required:true,
                min:100000,
                max:999999
            },
            description:{
                type:String
            },
            deadline:{
                type:String,
                required:true
            },
            fileURL:{
                type:Array
            },
            uploadedBy:{
                type:String,
                trim:true,
                required:true
            }    
    },
    {
        timestamps:true
    }
)

assignmentSchema.plugin(mongooseAggregatePaginate)

export const Assignment = mongoose.model("Assignment",assignmentSchema)