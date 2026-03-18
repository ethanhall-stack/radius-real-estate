import { useState, useEffect } from 'react'
import { X, Heart } from 'lucide-react'
import { setLeadIdentity, sendPropertyInterest } from '../services/webhook'

function formatPrice(price) {
  if (price >= 1_000_000) {
    const m = price / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  return `$${price.toLocaleString()}`
}

export default function LeadCaptureModal({ property, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [saving, setSaving] = useState(false)

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setLeadIdentity({ name: form.name, email: form.email, phone: form.phone })
    await sendPropertyInterest(property)
    onSaved(property.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-charcoal transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Property preview */}
        <div className="flex items-center gap-4 p-6 border-b border-stone-100">
          <div className="w-20 h-16 shrink-0 overflow-hidden">
            <img src={property.image} alt={property.address} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Heart size={11} className="text-gold fill-gold shrink-0" />
              <p className="text-[10px] tracking-widest uppercase text-gold">Saving Property</p>
            </div>
            <p className="text-sm font-medium text-charcoal truncate">{property.address}</p>
            <p className="font-serif text-sm text-gold">{formatPrice(property.price)}</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <h3 className="font-serif text-xl text-charcoal mb-1">Create Your Shortlist</h3>
          <p className="text-xs text-stone-400 mb-6">
            Enter your details to save this property and receive personalized updates from our team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal placeholder:text-stone-300 outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal placeholder:text-stone-300 outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (___) ___-____"
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal placeholder:text-stone-300 outline-none focus:border-gold transition-colors bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart size={13} className="fill-white" />
              {saving ? 'Saving…' : 'Save Property'}
            </button>
          </form>

          <p className="text-[10px] text-stone-300 text-center mt-5 leading-relaxed">
            By saving, you agree to receive property updates. Your information is never shared.
          </p>
        </div>
      </div>
    </div>
  )
}
