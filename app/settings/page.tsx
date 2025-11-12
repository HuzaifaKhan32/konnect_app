"use client"

import { ChevronRight, LogOut } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeSelector } from "@/components/theme-selector"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

const settingsGroups = [
  {
    title: "Account",
    items: [
      { label: "Account Settings", icon: "👤" },
      { label: "Privacy", icon: "🔒" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Notifications", icon: "🔔" },
      { label: "Appearance", icon: "🎨" },
      { label: "Help", icon: "❓" },
    ],
  },
]

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        {/* Profile Section */}
        <div className="border-b border-slate-700 p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="font-semibold text-white">Your Profile</p>
            <p className="text-sm text-gray-400">@yourname</p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <div key={group.title} className="border-b border-slate-700">
            <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-400 uppercase">{group.title}</h2>
            {group.items.map((item) => (
              <div key={item.label}>
                {item.label === "Appearance" ? (
                  <>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-all duration-300 text-left border-b border-slate-700">
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-white">{item.label}</span>
                      </span>
                    </button>
                    <div className="px-4 py-4 flex items-center justify-between bg-slate-800 bg-opacity-50">
                      <ThemeSelector />
                    </div>
                  </>
                ) : (
                  <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-all duration-300 text-left border-b border-slate-700">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-white">{item.label}</span>
                    </span>
                    {item.label !== "Appearance" && <ChevronRight size={20} className="text-gray-400" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" />
    </div>
  )
}
