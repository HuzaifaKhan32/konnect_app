"use client"

import { useState, useRef, useEffect } from "react"
import { Search, QrCode, MoreVertical, X } from "lucide-react"
import { ChatListItem } from "@/components/chat-list-item"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AddFriendModal } from "@/components/add-friend-modal"
import { HeaderMenu } from "@/components/header-menu"
import type { ChatPreview, User } from "@/lib/types"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { LoadingSpinner } from "@/components/loading-spinner"



export default function Home() {

  const [isSearching, setIsSearching] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const { user, userProfile, loading, hasUsername, checkingUsername, emailVerified } = useAuth()

  const router = useRouter()



  const [chats, setChats] = useState<ChatPreview[]>([]); // New state for chats



  useEffect(() => {

    if (!loading && !user) {

      router.push("/auth/login")

      return

    }

    if (user) {

      if (!checkingUsername && !hasUsername) {

        router.push("/create-username")

        return

      }



      // Fetch and listen for chats

      const q = query(

        collection(db, "chats"),

        where("participants", "array-contains", user.uid)

      );



      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const newChats = [...chats];

        for (const change of snapshot.docChanges()) {
          const chatDoc = change.doc;
          const chatData = chatDoc.data();
          const participants = chatData.participants as string[];
          const otherUserId = participants.find((pId) => pId !== user.uid);

          if (otherUserId) {
            const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
            if (otherUserDoc.exists()) {
              const otherUserData = otherUserDoc.data();
              const chat: ChatPreview = {
                id: chatDoc.id,
                user: { id: otherUserDoc.id, ...otherUserData } as User,
                lastMessage: chatData.lastMessage || "",
                lastMessageTimestamp: chatData.lastMessageTimestamp || null,
                unreadCount: chatData.unreadCount ? chatData.unreadCount[user.uid] : 0,
              };

              if (change.type === "added") {
                newChats.push(chat);
              }
              if (change.type === "modified") {
                const index = newChats.findIndex((c) => c.id === chat.id);
                if (index !== -1) {
                  newChats[index] = chat;
                }
              }
              if (change.type === "removed") {
                const index = newChats.findIndex((c) => c.id === chat.id);
                if (index !== -1) {
                  newChats.splice(index, 1);
                }
              }
            }
          }
        }

        // Sort chats by lastMessageTimestamp on the client-side
        newChats.sort((a, b) => {
          const timestampA = a.lastMessageTimestamp?.toMillis() || 0;
          const timestampB = b.lastMessageTimestamp?.toMillis() || 0;
          return timestampB - timestampA;
        });

        setChats(newChats);
      });



      return () => unsubscribe(); // Cleanup listener

    }

  }, [user, loading, hasUsername, checkingUsername, emailVerified, router])



  if (loading || checkingUsername || !user || !userProfile) {

    return <LoadingSpinner />

  }

  const filteredChats = searchQuery
    ? chats.filter((chat) => chat.user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats

  const handleAddFriend = async (friendUsername: string): Promise<string | null> => {
    if (!user || !userProfile || !friendUsername) return "An unexpected error occurred.";

    try {
      // 1. Find the friend by username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", friendUsername));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return "User not found.";
      }

      const friendDoc = querySnapshot.docs[0];
      const friendId = friendDoc.id;
      const friendData = friendDoc.data();

      if (friendId === user.uid) {
        return "You cannot add yourself as a friend.";
      }

      // 2. Check if a chat already exists between these two users
      const chatQuery1 = query(
        collection(db, "chats"),
        where("participants", "==", [user.uid, friendId])
      );
      const chatQuery2 = query(
        collection(db, "chats"),
        where("participants", "==", [friendId, user.uid])
      );

      const [snapshot1, snapshot2] = await Promise.all([getDocs(chatQuery1), getDocs(chatQuery2)]);

      if (!snapshot1.empty || !snapshot2.empty) {
        return "A chat with this user already exists.";
      }

      // 3. Create a new chat
      await addDoc(collection(db, "chats"), {
        participants: [user.uid, friendId],
        participantUsernames: [userProfile.username, friendData.username],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageTimestamp: serverTimestamp(),
        unreadCount: {
          [user.uid]: 0,
          [friendId]: 0,
        },
      });

      setIsAddFriendOpen(false); // Close the modal
      return null; // Success
    } catch (error) {
      console.error("Error adding friend or creating chat: ", error);
      return "An unexpected error occurred while adding friend.";
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          {!isSearching && (
            <>
              <h1 className="text-2xl font-bold text-white">Chat App</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Search size={20} className="text-gray-400" />
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <QrCode size={20} className="text-gray-400" />
                </button>
                <button
                  ref={menuButtonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
            </>
          )}

          {isSearching && (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder="Search Contact"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery("")
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <QrCode size={20} className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Header Menu */}
      <HeaderMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} triggerRef={menuButtonRef} />

      {/* Chat List */}
      <main className="flex-1 overflow-y-auto pb-32">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => <ChatListItem key={chat.id} chat={chat} />)
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No chats found</div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="chats" onAddFriendClick={() => setIsAddFriendOpen(true)} />

      {/* Add Friend Modal */}
      <AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} onConnect={handleAddFriend} />
    </div>
  )
}
