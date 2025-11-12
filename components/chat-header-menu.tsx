"use client"

import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface ChatHeaderMenuProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export function ChatHeaderMenu({ isOpen, onClose, onDelete, triggerRef }: ChatHeaderMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

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

  const menuPosition = triggerRef.current ? triggerRef.current.getBoundingClientRect() : { top: 0, right: 0 };

  return (
    <div
      ref={menuRef}
      className="absolute bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50"
      style={{ top: menuPosition.top + 40, right: 20 }}
    >
      <ul>
        <li>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 w-full text-sm"
          >
            <Trash2 size={18} />
            <span>Delete Chat</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
