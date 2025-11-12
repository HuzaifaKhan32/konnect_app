"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Loader2 } from "lucide-react"

interface UsernameModalProps {
  email: string
  onClose?: () => void
}

export default function UsernameModal({ email, onClose }: UsernameModalProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError("Username can only contain letters, numbers, underscores, and hyphens")
      return
    }

    setIsLoading(true)

    try {
      console.log("Creating username:", { email, username })
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      router.push("/")
    } catch (err) {
      setError("Failed to create username. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        {/* Modal Card */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full mb-4">
              <User size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Username</h2>
            <p className="text-gray-400 text-sm">Choose a unique username for your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-300 block">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-50"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">Letters, numbers, underscores, and hyphens only</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-in fade-in duration-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Footer Info */}
          <p className="text-center text-gray-500 text-xs mt-6">You can change your username anytime in settings</p>
        </div>
      </div>
    </div>
  )
}
