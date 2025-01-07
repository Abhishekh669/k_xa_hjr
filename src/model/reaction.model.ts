import mongoose, { Schema } from "mongoose";

const reactionSchema = new Schema({
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "WorkSpace",
        required : true
    },
    messageId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message",
        required : true,
    },
    memberId :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Member",
        required : true,
    },
    value : {
        type : String,
        required : true
    }
},{
    timestamps: true, // Adds `createdAt` and `updatedAt`
})

reactionSchema.index({workspaceId : 1},{name : "by_workspace_id"})
reactionSchema.index({messageId : 1},{name : "by_message_id"})
reactionSchema.index({memberId : 1},{name : "by_member_id"})

export const Reaction = mongoose.models.Reaction || mongoose.model("Reaction", reactionSchema);