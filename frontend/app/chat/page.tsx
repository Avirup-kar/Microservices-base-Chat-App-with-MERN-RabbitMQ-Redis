"use client"
import React, { useEffect, useState } from 'react'
import { chat_service, useAppData, User } from '../context/AppContext'
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';
import ChatSidebar from '../components/ChatSidebar';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import { SocketData } from '../context/SocketContext';
import { text } from 'stream/consumers';

export interface Message{
  _id: string
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatPage = () => {
  const {isAuth, loading, logoutUser, chats, user: loggedInUser, users, fetchChats, setChats} = useAppData();
  const { onlineUsers, socket } = SocketData();
  const router = useRouter();
  const [selecteduser, setSelecteduser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [siderbarOpen, setSiderbarOpen] = useState (false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null> (null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login");
    }
  }, [isAuth, loading, router]);

 const handleLogout = () => logoutUser();

 const moveChatToTop = (chatId: string, newMessage: any, updatedUnseenCount=true) => {
  
  console.log(newMessage)
  if(chats?.some((c) => c.chat._id === chatId)){
   setChats((prev) => {
    if(!prev) return null;
    
    const updatedChats = [...prev];
    const chatIndex = updatedChats.findIndex((chat) => chat.chat._id === chatId);
    if(chatIndex !== -1){
      const [moveChat] = updatedChats.splice(chatIndex, 1);

      const updatedChat = {
        ...moveChat, 
        chat: {
          ...moveChat.chat, latestMessage: {
            text: newMessage.text,
            sender: newMessage.sender
          },
          updatedAt: new Date().toString(),
          unseenCount: updatedUnseenCount && newMessage.sender !== loggedInUser?._id ? (moveChat.chat.unseenCount || 0) + 1 : moveChat.chat.unseenCount || 0,
        },
      };
      console.log("updatedChat.....",updatedChat)
      updatedChats.unshift(updatedChat)
    }
    return updatedChats
   })
   }else{
    
   }
 }

 const resetUnseenCount = (chatId: string)=>{
   setChats ((prev)=>{
    if(!prev) return null;
    
    return prev.map((chat)=>{
    if(chat.chat._id === chatId){
      return{
        ...chat,
        chat: {
          ...chat.chat,
          unseenCount: 0
        }
      }
    }
    return chat;
    })
   })
 }

 async function creatChat(u: User){
   const token = Cookies.get("token");
   try {
    const {data} = await axios.post(`${chat_service}/api/v1/chat/new`, {
      otherUserId: u._id
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setSelecteduser(data.chatId);
    setShowAllUser(false);
    await fetchChats();
   } catch (error) {
    toast.error("Failed to create chat");
   }
 }

 //send message
 const handleMessageSend = async (e: any, imageFile: File | null | undefined) => {
   e.preventDefault()
   if(!message.trim() && !imageFile) return;
   if(!selecteduser) return

   //Socket work
   if(typingTimeOut){
    clearTimeout(typingTimeOut);
    setTypingTimeOut(null);
   }

   socket?.emit("stopTyping", {
    chatId: selecteduser,
    userId: loggedInUser?._id
   })

   const token = Cookies.get("token")
   try {
    const formData = new FormData();

    formData.append("chatId", selecteduser);
    if(message.trim()){
      formData.append("text", message);
    } 
    if(imageFile){
      formData.append("image", imageFile);
    }

    const {data} = await axios.post(`${chat_service}/api/v1/message/send`, formData, {
       headers: {
        Authorization: `Bearer ${token}`
       }
    });

    setMessages((prev) => {
      const currentMessages = prev || [];
      const messageExists = currentMessages.some((msg) => msg._id === data.message._id);
      if(!messageExists){
        return [...currentMessages, data.message]
      }
      return currentMessages;
    });

    setMessage("")
    const displayText = imageFile ? "📷image": message;

    moveChatToTop(
      selecteduser!, 
        {
         text: displayText,
         sender: data.message.sender
        }, 
        false)
   } catch (error:  any) {
    toast.error(error.response.data.message);
    toast.error("Failed to send Message");
   }
  }
 

 const habdleTypeing = (value: string) => {
    setMessage(value);
    if(!selecteduser || !socket) return

    //socket setup
    if(value.trim()){
      socket?.emit("typing", {
        chatId: selecteduser,
        userId: loggedInUser?._id
      })
    }

    if(typingTimeOut){
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }

   const timout = setTimeout(()=>{
     socket.emit("stopTyping", {
     chatId: selecteduser,
     userId: loggedInUser?._id,
    });
   }, 2000);

 setTypingTimeOut(timout)
 }
 
 useEffect(()=>{
   socket?.on("newMessage", (message) => {
    console.log("Recieved new message:", message);
    if(selecteduser === message.chatId){
      setMessages((prev) => {
        const currentMessages = prev || [];
      const messageExists = currentMessages.some((msg) => msg._id === message._id);
      if(!messageExists){
        return [...currentMessages, message];
      }
      return currentMessages;
      })
      
      moveChatToTop(message.chatId, message, false);
    }else{
      moveChatToTop(message.chatId, message, true);
    }
   })

   socket?.on("messagesSeen", (data) => {
    console.log("Message seen by:", data);
    if(selecteduser === data.chatId){
      setMessages((prev) => {
        if(!prev) return null;
        return prev.map((msg) => {
           if(selecteduser === data.chatId && msg.sender === loggedInUser?._id && data.messageIds && data.messageIds.includes(msg._id)){
            return{
              ...msg, 
              seen: true,
              seenAt: new Date()
            }
           }else if(msg.sender === loggedInUser?._id && !data.messageIds){
            return{
              ...msg, 
              seen: true,
              seenAt: new Date()
            }
           }
           return msg;
        });
      })
    }
   })

    socket?.on("userTyping", (data) => {
     console.log("recieved user typing", data);
     if(data.chatId === selecteduser && data.userId !== loggedInUser?._id) {
     setIsTyping(true)
     }
    });

    socket?.on("userStoppedTyping", (data) => {
     console.log("recieved user stopped typing", data);
     if(data.chatId === selecteduser && data.userId !== loggedInUser?._id) {
     setIsTyping(false)
     }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
   }
 }, [socket, selecteduser, setChats, loggedInUser?._id])
  
 useEffect(() => {
   if(selecteduser){
     async function fetchChatMessages() {
   const token = Cookies.get("token");
   try {
     const {data} = await axios.get(`${chat_service}/api/v1/message/${selecteduser}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setMessages(data.messages);
    setUser(data.user)
    await fetchChats();
     } catch (error) {
       console.log(error);
       toast.error("Failed to fetch messages")
      }
    }

    fetchChatMessages();
    setIsTyping(false);

    resetUnseenCount(selecteduser);

    socket?.emit("joinChat", selecteduser);

    return () => {
      socket?.emit("leaveChat", selecteduser);
      setMessages(null);
    }
   }
 }, [selecteduser, socket])

 useEffect(() => {
   return () => {
      if(typingTimeOut){
         clearTimeout(typingTimeOut);
      }
   }
 }, [typingTimeOut])
 
 
  if(loading) return <Loading />
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar 
      siderbarOpen={siderbarOpen} 
      setSiderbarOpen={setSiderbarOpen} 
      showAllUser={showAllUser} 
      setShowAllUser={setShowAllUser} 
      users={users} 
      loggedInUser={loggedInUser} 
      chats={chats} 
      onlineUsers={onlineUsers}
      selecteduser={selecteduser} 
      setSelecteduser={setSelecteduser} 
      handleLogout={handleLogout}
      creatChat={creatChat} />

      <div className="flex-1 relative flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10">
        <ChatHeader user={user} onlineUsers={onlineUsers} setSidebarOpen={setSiderbarOpen} isTyping={isTyping}/>
        <ChatMessages selectedUser={selecteduser} messages={messages} loggedInUser={loggedInUser} />
        <MessageInput selecteduser={selecteduser} handleMessageSend={handleMessageSend} message={message} setMessage={habdleTypeing}/>
      </div>

    </div>
  )
}

export default ChatPage;
