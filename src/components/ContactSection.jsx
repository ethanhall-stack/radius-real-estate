import { useState } from 'react'
import { Send, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { sendInquiryLead } from '../services/webhook'

const inquiryTypes = ['Buying', 'Selling', 'Investment', 'Leasing', 'General Inquiry']

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Buying',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendInquiryLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        type: form.type,
        budget: form.budget,
        message: form.message,
      })
      setStatus('success')
      setForm({ name: '', email: '', phone: '', type: 'Buying', budget: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-charcoal py-24 lg:py-36">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left — Info */}
          <div className="lg:col-span-2">
            <p className="section-label text-gold-light mb-4">Get In Touch</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-8">
              Start Your
              <em className="block not-italic text-gold">Journey Home.</em>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-12">
              Whether you're searching for a specific property, planning to sell, or simply
              exploring what's possible, we're here to help. Every conversation begins with listening.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: '+1 (310) 555-0192' },
                { icon: Mail, label: 'hello@radiusre.com' },
                { icon: MapPin, label: '9100 Wilshire Blvd, Suite 700\nBeverly Hills, CA 90212' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-gold" />
                  </div>
                  <p className="text-white/60 text-sm whitespace-pre-line">{label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 my-10" />

            <p className="text-[10px] tracking-widest uppercase text-white/30">
              Availability Mon – Sat, 9am – 7pm PT
            </p>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                    placeholder="+1 (___) ___-____"
                  />
                </div>

                {/* Inquiry Type */}
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                  >
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t} className="text-charcoal">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                  Budget / Price Range
                </label>
                <input
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-gold transition-colors"
                  placeholder="e.g. $5M – $10M"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Tell us what you're looking for…"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  Thank you — we'll be in touch shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  Something went wrong. Please try again or call us directly.
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="btn-primary flex items-center gap-3 border border-gold bg-gold hover:bg-gold-dark hover:border-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                  {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
