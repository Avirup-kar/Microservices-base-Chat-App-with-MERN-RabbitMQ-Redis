import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer (app);


//Initialize socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods:["GET", "POST"],
  }
})

//store online users
export const userSocketMap: Record<string, string> = {};

//Socket.io conection handeler function
io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId
  console.log("User connected", socket.id)
  if(userId) userSocketMap[userId] = socket.id;

  //Emit all online users to all conected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })

  socket.on("connect_error", (error) => {
    console.log("Socket connection Error", error);
  });
})


export { app, io, server };