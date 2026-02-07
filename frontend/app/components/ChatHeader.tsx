import { Menu } from "lucide-react";
import React from "react";
import { User } from "../context/AppContext";

interface ChatHeaderProps {
 user: User | null;
 setSidebarOpen: (open: boolean) => void;
 isTyping: boolean;
} 
const ChatHeader = ({user, setSidebarOpen, isTyping}: ChatHeaderProps) => {
  return (
    <>
      {/* mobile menu toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button className="R-3 cursor-pointer bg-gray-800 rounded-1g ☐ hover:bg-gray-700 transition-colors">
          <Menu className="w-5 h-5 text-gray-200" />
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
