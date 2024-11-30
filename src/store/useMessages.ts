import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, set } from 'idb-keyval';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface MessagesState {
  messages: Record<string, Message[]>;
  sendMessage: (receiverId: string, content: string, type?: Message['type']) => Promise<void>;
  markAsRead: (messageIds: string[]) => void;
  getMessages: (friendId: string) => Message[];
}

export const useMessages = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: {},

      sendMessage: async (receiverId: string, content: string, type: Message['type'] = 'text') => {
        const message: Message = {
          id: crypto.randomUUID(),
          senderId: 'currentUser', // Replace with actual user ID
          receiverId,
          content,
          timestamp: new Date(),
          type,
          status: 'sent'
        };

        set(state => ({
          messages: {
            ...state.messages,
            [receiverId]: [...(state.messages[receiverId] || []), message]
          }
        }));
      },

      markAsRead: (messageIds: string[]) => {
        set(state => ({
          messages: Object.fromEntries(
            Object.entries(state.messages).map(([key, messages]) => [
              key,
              messages.map(msg =>
                messageIds.includes(msg.id) ? { ...msg, status: 'read' } : msg
              )
            ])
          )
        }));
      },

      getMessages: (friendId: string) => {
        return get().messages[friendId] || [];
      }
    }),
    {
      name: 'solmates-messages',
      storage: {
        getItem: async (name) => {
          const value = await get(name);
          return value ?? null;
        },
        setItem: async (name, value) => {
          await set(name, value);
        },
        removeItem: async (name) => {
          await set(name, undefined);
        },
      },
    }
  )
);