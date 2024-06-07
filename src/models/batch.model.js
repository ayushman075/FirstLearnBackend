import { ObjectId } from "mongodb";
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
            type:Array,
            default:[]
            },
        classRepresentative:{
            type:Array,
            default:[]
            },
        attendance:{
            type:Array,
            default:[]
        },
        isActive:{
            type:Boolean,
            default:true
        },
        admin:{
            type:Array,
            default:[]
            }
    },
    {
        timestamps:true
    }
)
batchSchema.plugin(mongooseAggregatePaginate)

export const Batch = mongoose.model("Batch",batchSchema)