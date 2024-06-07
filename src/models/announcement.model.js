import { ObjectId } from "mongodb";
import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const announcenmentSchema = new Schema(
    {

        announcementBody:{
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

announcenmentSchema.plugin(mongooseAggregatePaginate)

export const Announcement = mongoose.model("Announcement",announcenmentSchema)