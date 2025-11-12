"use client"

import Image from "next/image"
import Link from "next/link"
import type { ChatPreview } from "@/lib/types"

interface ChatListItemProps {
  chat: ChatPreview
}

export function ChatListItem({ chat }: ChatListItemProps) {
  return (
    <Link href={`/chat/${chat.id}`}>
      <div className="flex items-center justify-between px-4 py-6 hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-700">
        {/* Left side - Avatar and user info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src={chat.user.avatarUrl || "/placeholder.svg"}
              alt={chat.user.username}
              fill
              className="rounded-full object-cover"
            />
            {chat.user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{chat.user.username}</h3>
            <p className="text-base text-gray-400 truncate">{chat.lastMessage}</p>
          </div>
        </div>

        {/* Right side - Time and unread indicator */}
        <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
          {/* <span className="text-xs text-gray-400">{chat.lastMessageTime}</span> */}
          {chat.unreadCount > 0 && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
