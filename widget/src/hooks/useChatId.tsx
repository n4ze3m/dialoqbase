import { useState, useEffect } from "react";

const useChatId = (): string => {
  const [chatId, setChatId] = useState<string>("");

  useEffect(() => {
    const storedChatId = localStorage.getItem("DS_CHAT_ID");

    if (storedChatId) {
      setChatId(storedChatId);
    } else {
      const newChatId = crypto.randomUUID();
      localStorage.setItem("DS_CHAT_ID", newChatId);
      setChatId(newChatId);
    }
  }, []);

  return chatId;
};

export default useChatId;
