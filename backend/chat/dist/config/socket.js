import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
//Initialize socket.io server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
//store online users
export const userSocketMap = {};
//Socket.io conection handeler function
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId && userId !== undefined) {
        if (userId)
            userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }
    //Emit all online users to all conected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    if (userId) {
        socket.join(userId);
    }
    socket.on("typing", (data) => {
        console.log(`User ${data.userId} is typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userTyping", {
            chatId: data.chatId,
            userId: data.userId,
        });
    });
    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} stopped typing in chat ${data.chatId}`);
        socket.to(data.chatId).emit("userStoppedTyping", {
            chatId: data.chatId,
            userId: data.userId,
        });
    });
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        console.log(`User ${userId} joined chat room ${chatId}`);
    });
    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId);
        console.log(`User ${userId} left chat room ${chatId}`);
    });
    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log("User disconnected", socket.id);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
    socket.on("connect_error", (error) => {
        console.log("Socket connection Error", error);
    });
});
export { app, io, server };
//# sourceMappingURL=socket.js.map