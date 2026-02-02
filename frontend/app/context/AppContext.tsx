"use client"

import { createContext } from "react";

export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";

export interface User {
 _id: string;
 name: string;
 email: string;
}

export interface Chat{
 _id: string;
 users: string[];
 latestMessage: {
   text: string;
   sender: string;
 };
 createdAt: string;
 updatedAt: string;
 unseenCount?: number;
}

export interface Chats{
 _id: string;
 user: User;
 chat: Chat;
}

interface AppContextType {
 user: User | null;
 loading: boolean;
 isAuth: boolean;
 setUser: React.Dispatch<React.SetStateAction<User | null>>;
 setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
 children: React.ReactNode;
}

export const AppProvider = React.FC<AppProviderProps> = ({ Children }) => {

}