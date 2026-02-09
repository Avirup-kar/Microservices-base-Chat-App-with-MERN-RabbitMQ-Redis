import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import { app, Server, server } from "./config/socket.js";
dotenv.config();

const port = process.env.PORT || 5002;

//Initialize socket.io server
export const io = new Server(server, {
  cors: {origin: "*"}
})



app.use(express.json());
app.use(cors())
connectDb();

app.use("/api/v1", chatRoutes);
app.get("/", (req, res) => {
  res.json("Chat server is running")
})

server.listen(port, () => {
  console.log(`Chat server is running on port ${port}`);
});
