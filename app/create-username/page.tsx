"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function CreateUsernamePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { setHasUsername } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!auth.currentUser) {
      setError("You must be logged in to create a username.")
      setIsLoading(false)
      return
    }

    try {
      // Check if username already exists
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("username", "==", username))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError("Username already exists. Please choose another one.")
        setIsLoading(false)
        return
      }

      // Create user document
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username,
        email: auth.currentUser.email,
      })
      setHasUsername(true) // Update the context state
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create a Username</h1>
          <p className="text-gray-400">Choose a unique username to get started</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-300 block">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="e.g., john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Username"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
