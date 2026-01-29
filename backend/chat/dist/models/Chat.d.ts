import mongoose, { Document } from "mongoose";
export interface IChat extends Document {
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Chat: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=Chat.d.ts.map