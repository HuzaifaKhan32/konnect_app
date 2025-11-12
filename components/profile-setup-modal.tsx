"use client"

import type React from "react"

import { useState } from "react"

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (username: string) => void
}

export function ProfileSetupModal({ isOpen, onClose, onSave }: ProfileSetupModalProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSave(username)
      setUsername("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 w-96 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Setup Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              placeholder="@YourUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Save &amp; Continue
          </button>
        </form>
      </div>
    </div>
  )
}
