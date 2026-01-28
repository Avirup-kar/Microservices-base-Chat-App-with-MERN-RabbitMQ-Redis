import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
}
export declare const User: mongoose.Model<any, {}, {}, {}, any, any, any>;
//# sourceMappingURL=User.d.ts.map