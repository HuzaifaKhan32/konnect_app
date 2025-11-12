"use client"

import { useState, useEffect, useRef } from "react"

import { Send, Paperclip } from "lucide-react"

import { ChatHeader } from "@/components/chat-header"

import { ChatBubble } from "@/components/chat-bubble"

import type { Message, User } from "@/lib/types"

import { addDoc, collection, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, updateDoc, increment, deleteDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

import { useAuth } from "@/context/AuthContext"

import { useParams, useRouter } from "next/navigation"

import { DeleteChatModal } from "@/components/delete-chat-modal"

import { ChatHeaderMenu } from "@/components/chat-header-menu"



export default function ChatPage() {

  const params = useParams();

  const router = useRouter();

  const chatId = params.id as string;

  const { user } = useAuth();



  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");

  const [otherUser, setOtherUser] = useState<User | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleSend = async () => {
    if (inputValue.trim() && user && otherUser) {
      try {
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: user.uid,
          text: inputValue,
          timestamp: serverTimestamp(),
          chatId: chatId,
        });

        // Update the parent chat document with the last message and timestamp, and increment unread count
        const otherUserId = otherUser.id;
        await updateDoc(doc(db, "chats", chatId), {
          lastMessage: inputValue,
          lastMessageTimestamp: serverTimestamp(),
          [`unreadCount.${otherUserId}`]: increment(1),
        });
        setInputValue("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  useEffect(() => {
    if (!chatId || !user) return;

    // Set up message listener
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(), // Convert Firestore Timestamp to Date
      })) as Message[];
      setMessages(fetchedMessages);
    });

    // Reset unread count for the current user
    const resetUnreadCount = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      await updateDoc(chatDocRef, {
        [`unreadCount.${user.uid}`]: 0,
      });
    };

    if (user && chatId) {
      resetUnreadCount();
    }

    // Fetch other user details
    const fetchOtherUser = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const chatData = chatDocSnap.data();
        const participants = chatData?.participants as string[];
        const otherUserId = participants.find((pId) => pId !== user.uid);

        if (otherUserId) {
          const otherUserDocRef = doc(db, "users", otherUserId);
          const otherUserDocSnap = await getDoc(otherUserDocRef);
          if (otherUserDocSnap.exists()) {
            setOtherUser({ id: otherUserDocSnap.id, ...otherUserDocSnap.data() } as User);
          }
        }
      }
    };

    fetchOtherUser();

    // Cleanup listeners on component unmount
    return () => {
      unsubscribeMessages();
    };
  }, [chatId, user]);

  const handleDeleteChat = async () => {
    if (!chatId) return;
    try {
      await deleteDoc(doc(db, "chats", chatId));
      router.push("/");
    } catch (error) {
      console.error("Error deleting chat: ", error);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Chat Header */}
      <ChatHeader 
        user={otherUser} 
        menuButtonRef={menuButtonRef}
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      <ChatHeaderMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onDelete={() => setIsDeleteModalOpen(true)}
        triggerRef={menuButtonRef}
      />
      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteChat}
      />

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-20 scrollbar-hide">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} isOwn={message.senderId === user?.uid} />
        ))}
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
            <Paperclip size={20} className="text-blue-400" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <button onClick={handleSend} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
            <Send size={20} className="text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
