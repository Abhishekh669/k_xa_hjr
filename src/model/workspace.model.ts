import mongoose,{ Schema } from "mongoose";
interface IWorkSpace extends Document {
    name: string;
    userId: mongoose.Types.ObjectId; // Reference to the User model
    joinCode: string;
  }

const workSpace = new Schema<IWorkSpace>({
    name : {
        type : String, 
        required : true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true, 
    },
    joinCode : {
        type : String, required : true
    }
})

export const WorkSpace =  mongoose.models.WorkSpace || mongoose.model("WorkSpace", workSpace);