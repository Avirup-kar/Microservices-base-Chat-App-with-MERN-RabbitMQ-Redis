import mongoose, { Document, Schema, model } from "mongoose";
const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });
export const User = mongoose.models.User || model("User", schema);
//# sourceMappingURL=User.js.map