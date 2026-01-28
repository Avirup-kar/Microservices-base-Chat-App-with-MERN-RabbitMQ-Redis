import mongoose, { Document, Schema, model} from "mongoose";

export interface IUser extends Document {
   name: string,
   email: string
}

const schema = new Schema<IUser>({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
}, {timestamps: true})

export const User = mongoose.models.User || model<IUser>("User", schema);