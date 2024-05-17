import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const batchSchema=new Schema(
    {
        batchId:{
            type:Number,
            unique:true,
            required:true,
            min:100000,
            max:999999

        },
        batchname:{
            type:String,
            required:true,
           
        },
        description:{
            type:String,
            
        },
        faculty:{
            type:Array
        },
        classRepresentative:{
            type:Array
        },
        students:{
            type:Array
        },
        attendance:{
            type:Number
        },
        isActive:{
            type:Boolean,
            default:true
        },
        admin:{
            type:Array,
            required:true
        }
    },
    {
        timestamps:true
    }
)
batchSchema.plugin(mongooseAggregatePaginate)

export const Batch = mongoose.model("Batch",batchSchema)