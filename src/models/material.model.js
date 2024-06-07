import { ObjectId } from "mongodb";
import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const materialSchema = new Schema(
    {
            materialHeading:{
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

materialSchema.plugin(mongooseAggregatePaginate)

export const Material = mongoose.model("Material",materialSchema)