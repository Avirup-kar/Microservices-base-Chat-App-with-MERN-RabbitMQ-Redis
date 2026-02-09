"use client"
import { createContext } from "react";
import { Socket } from "socket.io-client"

interface SocketContextType{
   socket: Socket | null
}

const socketContext = createContext<SocketContextType>({
    socket: null
});

interface ProviderProps {
  children: React.ReactNode;
}

export const socketProvider = ({ children }: ProviderProps) => {
  


   return (
   <socketContext.Provider value={}>
        {children}
    </socketContext.Provider>
    )
}
