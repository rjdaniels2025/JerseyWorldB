'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'passcode')
      .single()

    if (data?.value === code.trim()) {
      sessionStorage.setItem('jwb_admin_auth', 'true')
      router.push('/admin')
    } else {
      setError('Incorrect passcode. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Jersey World B" width={160} height={44}
            className="h-14 w-auto object-contain mx-auto mb-6" />
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#c9a84c]">Admin Portal</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Passcode</label>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter passcode"
                autoFocus
                className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white text-sm placeholder-[#444] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] tracking-widest"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !code}
              className="w-full py-3 bg-[#c9a84c] text-black font-bold rounded-xl hover:bg-[#dfc06e] transition-all text-sm uppercase tracking-[0.1em] disabled:opacity-50">
              {loading ? 'Checking...' : 'Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
