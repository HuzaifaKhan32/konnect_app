"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { sendEmailVerification } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleResendVerification = async () => {
    if (!user) {
      setError("You are not logged in.")
      return
    }
    setIsLoading(true)
    setMessage("")
    setError("")
    try {
      await sendEmailVerification(user)
      setMessage("A new verification email has been sent.")
    } catch (err: any) {
      setError("Failed to send verification email. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Verify Your Email</h1>
          <p className="text-gray-400 mb-6">
            A verification link has been sent to your email address. Please click the link to continue.
          </p>

          {message && <div className="p-3 mb-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{message}</div>}
          {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

          <button
            onClick={handleResendVerification}
            disabled={isLoading}
            className="w-full mb-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Resend Verification Email"}
          </button>

          <button onClick={() => auth.signOut()} className="text-gray-400 hover:text-white transition-colors">
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}