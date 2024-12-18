import mongoose,{ Schema } from "mongoose";
const memberSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkSpace", 
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "member"], 
        required: true,
      },
    
})

memberSchema.index({ userId: 1 }, { name: "by_user_id" }); 
memberSchema.index({ workspaceId: 1 }, { name: "by_workspace_id" }); 
memberSchema.index({ workspaceId: 1, userId: 1 }, { name: "by_workspace_id_user_id" }); 

export const Member =  mongoose.models.Member || mongoose.model("Member",memberSchema );