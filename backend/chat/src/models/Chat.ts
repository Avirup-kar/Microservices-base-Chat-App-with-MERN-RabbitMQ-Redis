import mongoose, {Document, Schema, model} from "mongoose";

export interface IChat extends Document{
    users: string[],
    latestMessage: {
        text: string,
        sender: string
    };
    createdAt: Date,
    updatedAt: Date
}

const schema = new Schema<IChat>({
    users: [{type: String, require: true }],
    latestMessage: {
        text: String,
        sender: String
    },
}, {timestamps: true})

export const Chat = mongoose.models.Chat || model<IChat>("Chat", schema); 