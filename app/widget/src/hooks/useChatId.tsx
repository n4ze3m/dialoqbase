import { useState, useEffect } from "react";

const useChatId = () => {
  const [chatId, setChatId] = useState<string>("");

  const resetChatId = () => {
    const newChatId = crypto.randomUUID();
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
      const newChatId = crypto.randomUUID();
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
