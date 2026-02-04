import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";

app.use(cors())
dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT || 5002;
app.use(express.json());

app.use("/api/v1", chatRoutes);

app.listen(port, () => {
  console.log(`Chat server is running on port ${port}`);
});
