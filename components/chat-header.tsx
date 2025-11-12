"use client"

import Image from "next/image"
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

interface ChatHeaderProps {
  user: User | null
  menuButtonRef: React.RefObject<HTMLButtonElement>
  onMenuClick: () => void
}

export function ChatHeader({ user, menuButtonRef, onMenuClick }: ChatHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-700 z-40">
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-blue-400" />
            </button>
          </Link>
          {user ? (
            <>
              <div className="relative w-10 h-10">
                <Image
                  src={user.avatarUrl || "/placeholder.svg"}
                  alt={user.username}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold text-white">{user.username}</h2>
                <p className="text-xs text-gray-400">{user.isOnline ? "Active now" : "Offline"}</p>
              </div>
            </>
          ) : (
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Phone size={20} className="text-blue-400" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Video size={20} className="text-blue-400" />
          </button>
          <button ref={menuButtonRef} onClick={onMenuClick} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
