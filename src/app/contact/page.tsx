'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="bg-[#111111] min-h-screen pt-24 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions about our jerseys? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Info Cards */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', line1: 'hello@jerseyworldb.com', line2: 'Reply within 24 hours' },
              { icon: Phone, title: 'Phone', line1: '+1 (555) 123-4567', line2: 'Mon–Fri, 9am–6pm EST' },
              { icon: MapPin, title: 'Location', line1: '123 Jersey Street', line2: 'New York, NY 10001' },
            ].map(({ icon: Icon, title, line1, line2 }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a84c]/40 rounded-xl p-6 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#c9a84c] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm">{line1}</p>
                    <p className="text-gray-600 text-xs mt-1">{line2}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
                    <input
                      type={type} id={id} name={id}
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-[#333] rounded-lg bg-[#111] text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                  <textarea
                    id="message" name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    className="w-full px-4 py-3 border border-[#333] rounded-lg bg-[#111] text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#c9a84c] text-black font-bold rounded-lg hover:bg-[#e2c06a] transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/30 uppercase tracking-wide"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 pt-20 border-t border-[#2a2a2a]">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'What is your return policy?', a: 'We offer a 30-day money-back guarantee on all purchases in original condition.' },
              { q: 'How long does shipping take?', a: 'Standard shipping takes 5–7 business days. Express options are available.' },
              { q: 'Do you offer bulk discounts?', a: 'Yes! Team discounts available on orders of 10 or more jerseys.' },
              { q: 'Can I customize my jersey?', a: 'Absolutely — add custom names and numbers to any jersey.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a84c]/40 rounded-xl p-6 transition-colors"
              >
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
