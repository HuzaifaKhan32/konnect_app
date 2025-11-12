"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Users, Star, Settings } from "lucide-react"

interface HeaderMenuProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export function HeaderMenu({ isOpen, onClose, triggerRef }: HeaderMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.left - 140,
      })
    }
  }, [isOpen, triggerRef])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="fixed bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: "180px",
      }}
    >
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700 transition-colors text-left border-b border-slate-700">
        <MessageSquare size={18} className="text-blue-400" />
        <span>New Chat</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700 transition-colors text-left border-b border-slate-700">
        <Users size={18} className="text-blue-400" />
        <span>New Group</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700 transition-colors text-left border-b border-slate-700">
        <Star size={18} className="text-blue-400" />
        <span>Starred Chat</span>
      </button>
      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700 transition-colors text-left">
        <Settings size={18} className="text-blue-400" />
        <span>Settings</span>
      </button>
    </div>
  )
}
