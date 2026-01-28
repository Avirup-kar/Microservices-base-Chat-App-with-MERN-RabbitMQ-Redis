import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../model/User.js";
import Jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request{
  user?: IUser | null;
}

export const isAuth = async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: "Please Login -No auth header",});
            return;
        }

        const token = authHeader.split(" ")[1] as string;

        const decodeValue = Jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decodeValue || !decodeValue.user){
            res.status(401).json({message: "Invalid token",});
            return;
        }

        req.user = decodeValue.user; // attach user info

        next();
    } catch (error) {
        res.status(401).json({ message: "Please Login - JWT error", });
    }
}