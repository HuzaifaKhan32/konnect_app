"use client"

import type React from "react"

import { useState } from "react"
import { UserPlus, X, Loader2 } from "lucide-react"

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (username: string) => Promise<string | null>
}

export function AddFriendModal({ isOpen, onClose, onConnect }: AddFriendModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && !isConnecting) {
      setIsConnecting(true)
      setError(null)
      const errorMessage = await onConnect(username)
      if (errorMessage) {
        setError(errorMessage)
      } else {
        setUsername("")
        onClose()
      }
      setIsConnecting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 w-96 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-500 rounded-full p-4 mb-4">
            <UserPlus size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Add new friend</h2>
        </div>

        <p className="text-gray-300 text-center mb-6">
          Enter your friend&apos;s unique username to start a conversation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isConnecting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center disabled:bg-blue-500/50"
          >
            {isConnecting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
