import { create } from "zustand";

export type Message = {
  id: string;
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
  
  processing: boolean;
  setProcessing: (processing: boolean) => void;
};

export const useStoreMessage = create<State>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  history: [],
  setHistory: (history) => set({ history }),
  streaming: true,
  setStreaming: (streaming) => set({ streaming }),
  processing: false,
  setProcessing: (processing) => set({ processing }),
}));

type ReferenceState = {
  openReferences: boolean;
  setOpenReferences: (openReferences: boolean) => void;
  referenceData: any;
  setReferenceData: (referenceData: any) => void;
};

export const useStoreReference = create<ReferenceState>((set) => ({
  openReferences: false,
  setOpenReferences: (openReferences) => set({ openReferences }),
  referenceData: {},
  setReferenceData: (referenceData) => set({ referenceData }),
}));
