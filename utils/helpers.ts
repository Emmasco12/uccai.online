import { ChatSession } from "../types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

export const saveChatsToStorage = (chats: ChatSession[]) => {
  try {
    localStorage.setItem('uccai_chats', JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to save chats", e);
  }
};

export const getChatsFromStorage = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem('uccai_chats');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load chats", e);
    return [];
  }
};
