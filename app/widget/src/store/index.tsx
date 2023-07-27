import { create } from "zustand";

export type Message = {
  isBot: boolean;
  message: string;
  sources: any[];
};

export type History = {
  type: string;
  message: string;
}[];

type State = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  history: History;
  setHistory: (history: History) => void;
  streaming: boolean;
  setStreaming: (streaming: boolean) => void;
};

export const useStoreMessage = create<State>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  history: [],
  setHistory: (history) => set({ history }),
  streaming: false,
  setStreaming: (streaming) => set({ streaming }),
}));
