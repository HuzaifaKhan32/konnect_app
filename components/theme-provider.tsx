"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Apply saved theme on mount
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (theme: "light" | "dark" | "system") => {
    const html = document.documentElement
    if (theme === "light") {
      html.classList.remove("dark")
    } else if (theme === "dark") {
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

  if (!mounted) return null

  return <>{children}</>
}
