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
   }
 }, [selecteduser])
 
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
      selecteduser={selecteduser} 
      setSelecteduser={setSelecteduser} 
      handleLogout={handleLogout}
      creatChat={creatChat} />

      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10">
        <ChatHeader user={user} setSidebarOpen={setSiderbarOpen} isTyping={isTyping}/>
      </div>
    </div>
  )
}

export default ChatPage;
