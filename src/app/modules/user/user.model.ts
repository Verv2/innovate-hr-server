import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

export const User = model<TUser>("User", userSchema);
