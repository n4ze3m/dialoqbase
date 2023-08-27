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
  isFirstMessage: boolean;
  setIsFirstMessage: (isFirstMessage: boolean) => void;
  historyId: string | null;
  setHistoryId: (history_id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
};

export const useStoreMessage = create<State>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  history: [],
  setHistory: (history) => set({ history }),
  streaming: false,
  setStreaming: (streaming) => set({ streaming }),
  isFirstMessage: true,
  setIsFirstMessage: (isFirstMessage) => set({ isFirstMessage }),
  historyId: null,
  setHistoryId: (historyId) => set({ historyId }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),
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
