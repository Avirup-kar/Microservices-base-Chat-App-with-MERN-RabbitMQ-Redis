import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createNewChat, getAllChats, sendMessage } from "../controllers/chat.js";
import { upload } from "../middlewares/multer.js";

const chatRoutes = express.Router();

chatRoutes.post("/chat/new", isAuth, createNewChat);
chatRoutes.get("/chat/all", isAuth, getAllChats);
chatRoutes.post("/chat/send", isAuth, upload.single("image"), sendMessage);

export default chatRoutes;