import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Message {
  id: string; // Document ID
  chatId: string; // ID of the chat this message belongs to
  senderId: string;
  text: string;
  timestamp: Timestamp | Date; // Use Firestore Timestamp for storage, Date for display
}

export interface Chat {
  id: string; // Document ID
  participants: string[]; // Array of user IDs
  participantUsernames: string[]; // Array of usernames for display
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  createdAt: Timestamp;
  unreadCount?: { [key: string]: number };
}

export interface ChatPreview {
  id: string;
  user: User; // For 1-on-1 chats, this is the other user
  lastMessage: string;
  lastMessageTimestamp: Timestamp; // Add timestamp for sorting
  unreadCount: number;
}
