import mongoose, { Document, Types } from "mongoose";
export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: string;
    text?: string;
    image?: {
        url: string;
        publicId: string;
    };
    messageType: "text" | "image";
    seen: boolean;
    seenAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Messages: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Message.d.ts.map