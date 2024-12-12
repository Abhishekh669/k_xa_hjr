import mongoose,{ Schema } from "mongoose";
const workSpace = new Schema({
    name : {
        type : String, 
        required : true
    },
    userId : {
        type : String, required : true
    },
    joinCode : {
        type : String, required : true
    }
})

export const WorkSpace =  mongoose.models.WorkSpace || mongoose.model("WorkSpace", workSpace);