'use client'
import { useState } from 'react'
import { Mail, Phone, Instagram } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-[#111111] min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 text-lg mb-16">We value our customers and are always here to help.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <a href="mailto:Jerseyworldb@gmail.com"
              className="flex items-center gap-5 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/50 transition-all group">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                <Mail size={22} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
                <p className="text-white font-semibold">Jerseyworldb@gmail.com</p>
              </div>
            </a>

            <a href="tel:6479908100"
              className="flex items-center gap-5 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/50 transition-all group">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                <Phone size={22} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                <p className="text-white font-semibold">647-990-8100</p>
              </div>
            </a>

            <a href="https://instagram.com/JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/50 transition-all group">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                <Instagram size={22} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Instagram</p>
                <p className="text-white font-semibold">@JerseyWorldB</p>
              </div>
            </a>

            <a href="https://tiktok.com/@JerseyWorldB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#c9a84c]/50 transition-all group">
              <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors">
                <svg className="w-5 h-5 text-[#c9a84c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">TikTok</p>
                <p className="text-white font-semibold">JerseyWorldB</p>
              </div>
            </a>
          </div>

          {/* Message Form */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            {sent ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                      className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} required
                      className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Message</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} required rows={5}
                      className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-[#c9a84c] text-black font-black rounded-lg hover:bg-[#e2c06a] transition-all uppercase tracking-wide">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
