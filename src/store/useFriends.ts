import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, set } from 'idb-keyval';

interface FriendRequest {
  id: string;
  name: string;
  timestamp: Date;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
}

interface FriendsState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  updateFriendStatus: (friendId: string, status: Friend['status']) => void;
  getFriend: (friendId: string) => Friend | undefined;
  addPendingRequest: (request: FriendRequest) => Promise<void>;
  removePendingRequest: (requestId: string) => Promise<void>;
}

export const useFriends = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: [],
      pendingRequests: [],

      addFriend: async (friendId: string) => {
        try {
          const request = get().pendingRequests.find(req => req.id === friendId);
          if (!request) throw new Error('Friend request not found');

          const newFriend: Friend = {
            id: friendId,
            name: request.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendId}`,
            status: 'offline'
          };

          set(state => ({
            friends: [...state.friends, newFriend],
            pendingRequests: state.pendingRequests.filter(req => req.id !== friendId)
          }));

          await set(`friend:${friendId}`, newFriend);
        } catch (error) {
          console.error('Failed to add friend:', error);
          throw error;
        }
      },

      removeFriend: async (friendId: string) => {
        set(state => ({
          friends: state.friends.filter(friend => friend.id !== friendId)
        }));
        await set(`friend:${friendId}`, undefined);
      },

      updateFriendStatus: (friendId: string, status: Friend['status']) => {
        set(state => ({
          friends: state.friends.map(friend =>
            friend.id === friendId
              ? { ...friend, status, lastSeen: status === 'offline' ? new Date() : undefined }
              : friend
          )
        }));
      },

      getFriend: (friendId: string) => {
        return get().friends.find(friend => friend.id === friendId);
      },

      addPendingRequest: async (request: FriendRequest) => {
        set(state => ({
          pendingRequests: [...state.pendingRequests, request]
        }));
      },

      removePendingRequest: async (requestId: string) => {
        set(state => ({
          pendingRequests: state.pendingRequests.filter(req => req.id !== requestId)
        }));
      }
    }),
    {
      name: 'solmates-friends',
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