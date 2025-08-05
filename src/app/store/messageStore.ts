import { create } from "zustand";

export interface Message {
  id: string;
  roomId: string;
  sender: "user" | "ai";
  text?: string;
  image?: string;
  timestamp: number;
}

interface MessageState {
  messages: Message[];
  addMessage: (msg: Message) => void;
  getMessagesByRoom: (roomId: string) => Message[];
  getMessagesByRoomPaginated: (roomId: string, page: number, limit: number) => Message[];
  clearMessages: (roomId: string) => void;
}

const loadFromStorage = (): Message[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('messages');
  return raw ? JSON.parse(raw) : [];
};

const saveToStorage = (messages: Message[]) => {
  localStorage.setItem('messages', JSON.stringify(messages));
};

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: loadFromStorage(),
  addMessage: (msg) => {
    const updated = [...get().messages, msg];
    saveToStorage(updated);
    set({ messages: updated });
  },
  getMessagesByRoom: (roomId) =>
    get().messages.filter((msg) => msg.roomId === roomId),
  getMessagesByRoomPaginated: (roomId, page, limit) => {
    const roomMessages = get().messages.filter((msg) => msg.roomId === roomId);
    const startIndex = (page - 1) * limit;
    return roomMessages.slice(startIndex, startIndex + limit);
  },
  clearMessages: (roomId) => {
    const updated = get().messages.filter((msg) => msg.roomId !== roomId);
    saveToStorage(updated);
    set({ messages: updated });
  },
}));
