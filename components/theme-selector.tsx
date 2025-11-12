"use client"

import { Sun, Moon, Laptop } from "lucide-react"
import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement
    if (newTheme === "light") {
      html.classList.remove("dark")
    } else if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      // System default
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
      }
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
          theme === "light"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
            : "bg-slate-700 text-gray-400 hover:bg-slate-600"
        }`}
        title="Light"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
          theme === "dark"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
            : "bg-slate-700 text-gray-400 hover:bg-slate-600"
        }`}
        title="Dark"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
          theme === "system"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
            : "bg-slate-700 text-gray-400 hover:bg-slate-600"
        }`}
        title="System Default"
      >
        <Laptop size={18} />
      </button>
    </div>
  )
}
