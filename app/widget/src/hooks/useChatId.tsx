import { useState, useEffect } from "react";
import { generateUUID } from "../utils/uuid";
const useChatId = () => {
  const [chatId, setChatId] = useState<string>("");

  const resetChatId = () => {
    const newChatId = generateUUID();
    localStorage.removeItem("DS_MESSAGE");
    localStorage.removeItem("DS_HISTORY");
    localStorage.setItem("DS_CHAT_ID", newChatId);
    setChatId(newChatId);
  };

  useEffect(() => {
    const storedChatId = localStorage.getItem("DS_CHAT_ID");

    if (storedChatId) {
      setChatId(storedChatId);
    } else {
      const newChatId = generateUUID();
      localStorage.setItem("DS_CHAT_ID", newChatId);
      setChatId(newChatId);
    }
  }, []);

  return {
    chatId,
    resetChatId,
  };
};

export default useChatId;
