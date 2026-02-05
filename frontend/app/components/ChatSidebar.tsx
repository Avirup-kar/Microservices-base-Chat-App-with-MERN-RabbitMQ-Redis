import React, { useState } from "react";
import { Chats, User } from "../context/AppContext";
import { MessageCircle, Plus, Search, UserCircle, X } from "lucide-react";

interface chatSidebarProps {
  siderbarOpen: boolean;
  setSiderbarOpen: (open: boolean) => void;
  showAllUser: boolean;
  setShowAllUser: (show: boolean) => void;
  users: User[] | null;
  loggedInUser: User | null;
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
  loggedInUser,
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

      <div className="flex-1 overflow-hidden px-4 py-2">
         {showAllUser ? <div className="space-y-4 h-full">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
             <input type="text" 
             value={searchQuery} 
             placeholder="Search Users..." 
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400" />
           </div>

           {/* User list */}

           <div className="space-y-2 overflow-y-auto h-full pb-4">
            {
              users?.filter((u) => u._id !== loggedInUser?._id && u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user, index) => (
                <button key={user._id} className="w-full text-left p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="relative">
                         <UserCircle className="w-6 h-6 text-gray-300" />
                       </div>

                       {/* Online symbol dikhana hain */}
                       <div className="flex-1 min-w-0">
                         <span className="font-medium text-white">{user.name}</span>
                         <div className="text-xs text-gray-400 mt-0.5">
                           {/* to show online offline text */}
                         </div>
                       </div>
                     </div>
                </button>
              ))
            }
           </div>
         </div> : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4">
                
          </div>
           ) : (
           <div></div>
          )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
