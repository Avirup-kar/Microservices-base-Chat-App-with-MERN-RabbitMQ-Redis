import type { NextFunction, Request, Response } from "express";
interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
}
export interface authencatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: authencatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=isAuth.d.ts.map