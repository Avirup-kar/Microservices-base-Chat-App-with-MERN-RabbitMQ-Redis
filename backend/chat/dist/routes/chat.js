import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createNewChat, getAllChats } from "../controllers/chat.js";
const chatRoutes = express.Router();
chatRoutes.post("/chat/new", isAuth, createNewChat);
chatRoutes.get("/chat/all", isAuth, getAllChats);
export default chatRoutes;
//# sourceMappingURL=chat.js.map