import mongoose, { Schema } from "mongoose";

const verificationTokenSchema = new Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // Generates a unique string ID
  },
  
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, 
});

// Compound unique index for email and token
verificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

export const VerificationToken = mongoose.models.VerificationToken || mongoose.model("VerificationToken",verificationTokenSchema);