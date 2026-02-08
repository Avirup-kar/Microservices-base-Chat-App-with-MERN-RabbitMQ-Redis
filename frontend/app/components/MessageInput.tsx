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
    <form action="">
      
    </form>
  );
};

export default MessageInput;
