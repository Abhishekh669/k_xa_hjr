import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema({
    name : {
        type : String, 
        required : true,
    },
    workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkSpace", 
            required: true,
    },
    
})

channelSchema.index({ workspaceId: 1 }, { name: "by_workspace_id" }); 

export const Channel = mongoose.models.Channel||  mongoose.model("Channel", channelSchema)