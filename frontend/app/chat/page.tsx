"use client"
import React, { useEffect, useState } from 'react'
import { useAppData, User } from '../context/AppContext'
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';

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
  const [siderbarOpen, setSiderbarOpen] = useState (false);hghgggrgrg
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null> (null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login");
    }
  }, [isAuth, loading, router])
  
  if(loading) return <Loading />
  return (
    <div>
      chatApp
    </div>
  )
}

export default ChatPage;
