import React, { useState } from "react";
import { Chats, User } from "../context/AppContext";
import { MessageCircle, Plus, X } from "lucide-react";

interface chatSidebarProps {
  siderbarOpen: boolean;
  setSiderbarOpen: (open: boolean) => void;
  showAllUser: boolean;
  setShowAllUser: (show: boolean) => void;
  users: User[] | null;
  loggedInuser: User | null;
  chats: Chats[] | null;
  selecteduser: string | null;
  setSelecteduser: (userId: string | null) => void;
  handleLogout: () => void;
}

const ChatSidebar = ({
  siderbarOpen,
  setSiderbarOpen,
  showAllUser,
  setShowAllUser,
  users,
  loggedInuser,
  chats,
  selecteduser,
  setSelecteduser,
  handleLogout,
}: chatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${siderbarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform duration-300 flex flex-col`}>
      {/* header */}
      <div className="p-6 border-b border-gray-700">
        <div className="sm:hidden flex justify-end mb-0">
          <button onClick={() => setSiderbarOpen(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-blue-600 justify-between rounded-xl">
                    <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white"> {showAllUser? "New Chat": "Messages"} </h2>
            </div>
            
            <button onClick={() => setShowAllUser(!showAllUser)} className={`p-2.5 cursor-pointer rounded-lg transition-colors ${ showAllUser ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}>
              {
                showAllUser ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />
              }
            </button>
        </div>
      </div>

      {/* content */}

      
    </aside>
  );
};

export default ChatSidebar;
