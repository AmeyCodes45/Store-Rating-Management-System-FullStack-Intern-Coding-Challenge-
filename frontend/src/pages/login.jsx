import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      setToken(data.access_token)
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <motion.div layout className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className="text-3xl font-semibold tracking-tight text-white">
              Sign in
            </motion.h1>
            <p className="text-sm text-gray-400">Use your administrator credentials</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="administrator@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" required />
            </div>
            <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition px-4 py-3 text-white font-medium disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
            {error && <div className="text-sm text-red-400">{error}</div>}
            {token && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-400 break-all">
                {token}
              </motion.div>
            )}
          </form>
          <div className="mt-6 text-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs text-gray-500">
              Default admin: administrator@example.com / Admin@123
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
