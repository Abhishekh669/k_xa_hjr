
import mongoose,{ Schema } from "mongoose";

const conversation_schema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId, // Reference to the 'workspaces' collection
      ref: "WorkSpace",
      required: true,
    },
    memberOneId: {
      type: Schema.Types.ObjectId, // Reference to the 'members' collection
      ref: "Member",
      required: true,
    },
    memberTwoId: {
      type: Schema.Types.ObjectId, // Reference to the 'members' collection
      ref: "Member",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

conversation_schema.index({workspaceId : 1},{name : "by_workspace_id"});
export const Conversation = mongoose.model("Conversation", conversation_schema);


