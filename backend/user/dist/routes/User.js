import express from "express";
import { getAllUsers, getAUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
const userRoutes = express.Router();
userRoutes.post("/login", loginUser);
userRoutes.post("/verify", verifyUser);
userRoutes.get("/me", isAuth, myProfile);
userRoutes.get("/user/all", isAuth, getAllUsers);
userRoutes.get("/user/:id", getAUser);
userRoutes.post("/update/userName", isAuth, updateName);
export default userRoutes;
//# sourceMappingURL=user.js.map