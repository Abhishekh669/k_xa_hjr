import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId ,
      ref: "Storage", // Reference to the '_storage' collection
      required: false,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // Reference to the 'members' collection
      required: true,
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "WorkSpace", 
        required : true
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel", // Reference to the 'channels' collection
      required: false,
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference to the 'message' collection (self-reference)
      required: false,
    },
    conversationId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Conversation",
      required : false,
    },
    //add conversation ID 
    updatedAt: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' timestamps
  }
);

messageSchema.index({workspaceId : 1},{name : "by_workspace_id"})
messageSchema.index({memberId: 1},{name : "by_member_id"})
messageSchema.index({channelId: 1},{name : "by_channel_id"})
messageSchema.index({conversationId: 1},{name : "by_conversation_id"})
messageSchema.index({parentMessageId: 1},{name : "by_parent_message_id"})
messageSchema.index({channelId : 1, parentMessageId : 1 ,conversationId : 1},{name : "by_channel_id_parent_message_id_conversation_id"})

export const Message = mongoose.models.Message || mongoose.model("Message",messageSchema)
