"use client"

import { X, Trash2 } from "lucide-react"

interface DeleteChatModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteChatModal({ isOpen, onClose, onConfirm }: DeleteChatModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 w-96 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-500 rounded-full p-4 mb-4">
            <Trash2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Delete Chat</h2>
        </div>

        <p className="text-gray-300 text-center mb-6">
          Are you sure you want to delete this chat? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
