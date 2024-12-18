import mongoose, { mongo, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  authProvider: "google" | "github" | "credentials";
  emailVerified : Date
}


const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    require : function (this: IUser) {
      return this.authProvider == "credentials"
    },
    select : false
  },
  image: {
    type: String,
  },
  authProvider : {
    type: String,
    enum: ["google", "github", "credentials"], 
    required: true,
  },
  emailVerified: {
    type: Date,
    default: null, // Default to null if the email is not verified
  },
});

userSchema.index({ email: 1, authProvider: 1 }, { unique: true });

export const  User = mongoose.models.User || mongoose.model("User", userSchema);
