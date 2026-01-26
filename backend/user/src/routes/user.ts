import express from "express";
import { loginUser } from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.post("/login", loginUser);

export default userRoutes;