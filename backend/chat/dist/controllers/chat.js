import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/Chat.js";
import { Messages } from "../models/Message.js";
import { getRecieverSocketId, io } from "../config/socket.js";
//To craet a chat
export const createNewChat = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(401).json({
            message: "Other userid is required",
        });
        return;
    }
    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
        res.json({
            message: "chat already exists",
            chatId: existingChat._id,
        });
        return;
    }
    const newChat = await Chat.create({
        users: [userId, otherUserId],
    });
    res.status(201).json({
        message: "New chat created",
        chatId: newChat._id,
    });
});
//Get all chats for user
export const getAllChats = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            message: "User unauthorized",
        });
        return;
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        const unseenCount = await Messages.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            seen: false,
        });
        try {
            const { data } = await axios.get(`${process.env.USER_SERVER}/api/v1/user/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
        catch (error) {
            console.log(error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
    }));
    res.json({
        chats: chatWithUserData,
    });
});
//Send message to a chat
export const sendMessage = TryCatch(async (req, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;
    if (!senderId) {
        res.status(401).json({
            message: "User unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "chatId is required",
        });
        return;
    }
    if (!text && !imageFile) {
        res.status(400).json({
            message: "Either text or image is required",
        });
        return;
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found",
        });
        return;
    }
    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this chat",
        });
        return;
    }
    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString());
    if (!otherUserId) {
        res.status(403).json({
            message: "No other user in this chat",
        });
        return;
    }
    //Socket setup
    const receiverSocketId = getRecieverSocketId(otherUserId.toString());
    let isReceiverInChatRoom = false;
    if (receiverSocketId) {
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        if (receiverSocket && receiverSocket.rooms.has(chatId)) {
            isReceiverInChatRoom = true;
        }
    }
    let messageData = {
        chatId,
        sender: senderId,
        seen: isReceiverInChatRoom,
        seenAt: isReceiverInChatRoom ? new Date() : undefined,
    };
    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicid: imageFile.filename
        };
        messageData.messageType = "image";
        messageData.text = text || "";
    }
    else {
        messageData.text = text;
        messageData.messageType = "text";
    }
    const newMessage = new Messages(messageData);
    const savedMessage = await newMessage.save();
    //Update chat latest message
    const latestMessagetext = imageFile ? "📷Image" : text;
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: latestMessagetext,
            sender: senderId,
        },
        updatedAt: new Date(),
    }, { new: true });
    //emit to socket
    io.to(chatId).emit("newMessage", savedMessage);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
    }
    const senderSocketId = getRecieverSocketId(senderId.toString());
    if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", savedMessage);
    }
    if (isReceiverInChatRoom && senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
            chatId: chatId,
            seenBy: otherUserId,
            messageIds: [savedMessage._id]
        });
    }
    res.status(201).json({
        message: savedMessage,
        send: senderId,
    });
});
//Get messages of a chat
export const getMessageByChat = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;
    if (!userId) {
        res.status(401).json({
            message: "User unauthorized",
        });
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "chatId is required",
        });
        return;
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found",
        });
        return;
    }
    const isUserInChat = chat.users.some((userID) => userID.toString() === userId.toString());
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not a participant of this chat",
        });
        return;
    }
    const messagesToMarkSeen = await Messages.find({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    });
    await Messages.updateMany({
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
    }, {
        seen: true,
        seenAt: new Date(),
    });
    const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });
    const otherUserId = chat.users.find((userID) => userID !== userId);
    try {
        const { data } = await axios.get(`${process.env.USER_SERVER}/api/v1/user/${otherUserId}`);
        if (!otherUserId) {
            res.status(404).json({
                message: "No other user",
            });
            return;
        }
        //socket event for seen messages
        if (messagesToMarkSeen.length > 0) {
            const otherUserSocketId = getRecieverSocketId(otherUserId.toString());
            if (otherUserSocketId) {
                io.to(otherUserSocketId).emit("messagesSeen", {
                    chatId: chatId,
                    seenBy: otherUserId,
                    messageIds: messagesToMarkSeen.map((msg) => msg._id)
                });
            }
        }
        res.json({
            messages,
            user: data
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            messages,
            user: { _id: otherUserId, name: "Unknown User" }
        });
    }
});
//# sourceMappingURL=chat.js.map