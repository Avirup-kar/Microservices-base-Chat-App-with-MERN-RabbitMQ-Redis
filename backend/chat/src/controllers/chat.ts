import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import type { authencatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/Chat.js";
import { Messages } from "../models/Message.js";

//To craet a chat
export const createNewChat = TryCatch(async (req: authencatedRequest, res) => {
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
export const getAllChats = TryCatch(async (req: authencatedRequest, res) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({
      message: "User unauthorized",
    });
    return;
  }

  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id: string) => id !== userId);

      const unseenCount = await Messages.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });

      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVER}/api/v1/user/${otherUserId}`,
        );
        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (error) {
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
    }),
  );

  res.json({
    chats: chatWithUserData,
  });
});

//Send message to a chat
export const sendMessage = TryCatch(async (req: authencatedRequest, res) => {
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

  const isUserInChat = chat.users.some((userId: any) => userId.toString() === senderId.toString());

  if(!isUserInChat){
    res.status(403).json({
      message: "You are not a participant of this chat",
    });
    return;
  }

  const otherUserId = chat.users.find((userId: any) => userId.toString() !== senderId.toString());

  if(!otherUserId){
    res.status(403).json({
      message: "No other user in this chat",
    });
    return;
  }
 
  //Socket setup

  let messageData: any = {
    chatId,
    sender: senderId,
    seen: false,
    seenAt: undefined,
  }
});
