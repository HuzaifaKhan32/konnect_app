"use client"

import type { Message } from "@/lib/types"

interface ChatBubbleProps {
  message: Message
  isOwn: boolean
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const timestamp = message.timestamp instanceof Date ? message.timestamp : (message.timestamp as any)?.toDate();

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3 px-4`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${isOwn ? "bg-blue-500 text-white" : "bg-slate-700 text-gray-100"}`}
      >
        <p className="text-base break-words">{message.text}</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-400"}`}>
          {timestamp?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
