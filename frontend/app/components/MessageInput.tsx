import { Loader2, Paperclip, Send, X } from "lucide-react";
import React, { useState } from "react";

interface messageInputProps {
  selecteduser: string | null;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
  message: string;
  setMessage: (message: string) => void;
}

const MessageInput = ({
  selecteduser,
  handleMessageSend,
  message,
  setMessage,
}: messageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selecteduser) return null;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col fixed w-full bottom-4 gap-2 pt-2 pr-8">
      {imageFile && (
        <div className="relative w-fit">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-30 h-30 object-cover rounded-lg border border-gray-600"
          />
          <button type="button" className="absolute cursor-pointer -top-2 -right-2 bg-black rounded-full p-1" onClick={() => setImageFile(null)}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
         <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors">
          <Paperclip size={18} className="text-gray-300"/>
          <input type="file" accept="image/*" className="hidden" onChange={e=>{
               const file = e.target.files?.[0];
               if(file && file.type.startsWith("image/")){
                setImageFile(file)
               }
               }} />
          </label>

          <input 
            type="text" 
            className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400" 
            placeholder={imageFile? "Add a caption...": "Type a message..."} 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />

          <button type="submit" disabled={(!imageFile && !message) || isUploading} className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-white">
             {isUploading ? (<Loader2 className="w-4 h-4 animate-spin" />):(<Send className="w-4 h-4" />)}
          </button>
      </div>
    </form>
  );
};

export default MessageInput;
