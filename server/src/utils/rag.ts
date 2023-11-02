import { Document } from "langchain/document";

export type ChatMessage = {
  type: "human" | "ai" | "other";
  text: string;
};

export type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: ChatMessage[];
};

export const formatChatHistory = (history: ChatMessage[]): string => {
  return history
    .map((chatMessage: ChatMessage) => {
      if (chatMessage.type === "human") {
        return `Human: ${chatMessage.text}`;
      } else if (chatMessage.type === "ai") {
        return `Assistant: ${chatMessage.text}`;
      } else {
        return `${chatMessage.text}`;
      }
    })
    .join("\n");
};

export const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};
