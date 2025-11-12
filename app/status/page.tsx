"use client"
import { useState, useRef } from "react"
import { Search, QrCode, MoreVertical, X, Camera } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HeaderMenu } from "@/components/header-menu"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for status updates
const statusUpdates = [
  {
    id: 1,
    name: "My Status",
    time: "Tap to add status update",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Alice",
    time: "Today, 10:30 AM",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Bob",
    time: "Today, 9:15 AM",
    avatar: "/placeholder-user.jpg",
  },
]

export default function StatusPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { user, loading, checkingUsername, hasUsername } = useAuth()
  const router = useRouter()

  if (loading || checkingUsername) {
    return <LoadingSpinner />
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (!hasUsername) {
    router.push("/create-username")
    return null
  }

  const filteredStatus = searchQuery
    ? statusUpdates.filter((status) => status.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : statusUpdates

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          {!isSearching && (
            <>
              <h1 className="text-2xl font-bold text-white">Status</h1>
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
                placeholder="Search Status"
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
            </div>
          )}
        </div>
      </header>

      {/* Header Menu */}
      <HeaderMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} triggerRef={menuButtonRef} />

      {/* Status List */}
      <main className="flex-1 overflow-y-auto pb-32">
        {filteredStatus.map((status) => (
          <div key={status.id} className="flex items-center p-4 border-b border-slate-800">
            <div className="relative">
              <img src={status.avatar} alt={status.name} className="w-12 h-12 rounded-full" />
              {status.name === "My Status" && (
                <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <Camera size={16} className="text-white" />
                </button>
              )}
            </div>
            <div className="ml-4">
              <p className="font-semibold text-white">{status.name}</p>
              <p className="text-sm text-gray-400">{status.time}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="status" />
    </div>
  )
}