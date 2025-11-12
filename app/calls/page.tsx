"use client"
import { useState, useRef } from "react"
import { Search, QrCode, MoreVertical, X, Phone, Video } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HeaderMenu } from "@/components/header-menu"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for call history
const callHistory = [
  {
    id: 1,
    name: "Alice",
    type: "incoming",
    status: "missed",
    time: "Yesterday, 10:30 PM",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Bob",
    type: "outgoing",
    status: "answered",
    time: "Yesterday, 8:15 PM",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Charlie",
    type: "incoming",
    status: "answered",
    time: "October 28, 5:45 PM",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "David",
    type: "outgoing",
    status: "missed",
    time: "October 27, 11:00 AM",
    avatar: "/placeholder-user.jpg",
  },
]

export default function CallsPage() {
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

  const filteredCalls = searchQuery
    ? callHistory.filter((call) => call.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : callHistory

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          {!isSearching && (
            <>
              <h1 className="text-2xl font-bold text-white">Calls</h1>
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
                placeholder="Search Calls"
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

      {/* Call List */}
      <main className="flex-1 overflow-y-auto pb-32">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <div key={call.id} className="flex items-center p-4 border-b border-slate-800">
              <img src={call.avatar} alt={call.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-1">
                <p className={`font-semibold ${call.status === "missed" ? "text-red-500" : "text-white"}`}>
                  {call.name}
                </p>
                <p className="text-sm text-gray-400">{call.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <Phone size={20} className="text-green-500" />
                </button>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <Video size={20} className="text-blue-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No calls found</div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calls" />
    </div>
  )
}