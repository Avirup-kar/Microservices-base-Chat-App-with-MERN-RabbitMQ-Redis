import React from "react";

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
  return <div>hiii</div>;
};

export default MessageInput;
