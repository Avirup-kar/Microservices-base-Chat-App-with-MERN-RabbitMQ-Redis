import express from "express";
import { loginUser, verifyUser } from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.post("/login", loginUser);
userRoutes.post("/verify", verifyUser);

export default userRoutes;