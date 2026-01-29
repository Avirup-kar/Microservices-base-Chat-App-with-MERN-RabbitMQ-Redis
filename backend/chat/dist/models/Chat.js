import mongoose, { Document, Schema, model } from "mongoose";
const schema = new Schema({
    users: [{ type: String, require: true }],
    latestMessage: {
        text: String,
        sender: String
    },
}, { timestamps: true });
export const Chat = mongoose.models.Chat || model("Chat", schema);
//# sourceMappingURL=Chat.js.map