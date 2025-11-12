"use client"
import { MessageCircle, Camera, Phone, Settings, Plus } from "lucide-react"
import Link from "next/link"

interface BottomNavigationProps {
  activeTab?: "chats" | "status" | "calls" | "settings"
  onAddFriendClick?: () => void
}

export function BottomNavigation({ activeTab = "chats", onAddFriendClick }: BottomNavigationProps) {
  const tabs = [
    { id: "chats", icon: MessageCircle, label: "Chats" },
    { id: "status", icon: Camera, label: "Status" },
    { id: "calls", icon: Phone, label: "Calls" },
    { id: "settings", icon: Settings, label: "Settings" },
  ] as const

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center pb-6 pointer-events-none">
      {/* Main Navigation Bar */}
      <div className="bg-slate-900 rounded-full px-8 py-3 shadow-xl flex items-center gap-8 pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Link key={tab.id} href={tab.id === "chats" ? "/" : `/${tab.id}`}>
              <button
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                  isActive
                    ? "bg-blue-400 text-slate-900 shadow-lg shadow-blue-400/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-slate-800"
                }`}
                title={tab.label}
              >
                <Icon size={20} />
              </button>
            </Link>
          )
        })}
      </div>

      {/* Right Add Friend FAB */}
      <button
        onClick={onAddFriendClick}
        className="absolute right-6 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer pointer-events-auto"
      >
        <Plus size={18} />
      </button>
    </div>
  )
}
