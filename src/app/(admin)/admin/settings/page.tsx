'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, LogOut } from 'lucide-react'

export default function AdminSettings() {
  const [passcode, setPasscode] = useState('')
  const [newPasscode, setNewPasscode] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('admin_settings').select('value').eq('key', 'passcode').single()
      if (data) setPasscode(data.value)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPasscode.trim()) return
    setLoading(true)
    await supabase.from('admin_settings')
      .update({ value: newPasscode.trim(), updated_at: new Date().toISOString() })
      .eq('key', 'passcode')
    setPasscode(newPasscode.trim())
    setNewPasscode('')
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('jwb_admin_auth')
    router.push('/admin/login')
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your admin passcode</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#333] text-gray-400 rounded-lg hover:border-red-500 hover:text-red-400 transition-all text-sm">
          <LogOut size={14} /> Log Out
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-1">Change Passcode</h2>
        <p className="text-gray-600 text-xs mb-5">Current passcode: <span className="text-[#c9a84c] font-mono">{passcode}</span></p>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            value={newPasscode}
            onChange={e => setNewPasscode(e.target.value)}
            placeholder="Enter new passcode"
            className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
          />
          <button type="submit" disabled={loading || !newPasscode.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#dfc06e] transition-all text-sm disabled:opacity-50">
            <Save size={14} /> {saved ? 'Saved!' : 'Save Passcode'}
          </button>
        </form>
      </div>
    </div>
  )
}
