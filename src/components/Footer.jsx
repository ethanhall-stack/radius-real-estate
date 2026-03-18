import { useState } from 'react'
import { Instagram, Linkedin, Facebook, CheckCircle } from 'lucide-react'
import { sendNewsletterLead } from '../services/webhook'

const footerLinks = {
  Properties: ['For Sale', 'For Lease', 'New Listings', 'Price Reductions', 'Off-Market'],
  Neighborhoods: ['Beverly Hills', 'Bel Air', 'Malibu', 'Holmby Hills', 'Pacific Palisades'],
  Company: ['About Radius', 'Meet the Team', 'Journal', 'Press', 'Careers'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Fair Housing Notice', 'Accessibility'],
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    await sendNewsletterLead(email)
    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle size={15} />
        You're on the list.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-0">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-gold/50 transition-colors w-full md:w-64"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-gold hover:bg-gold-dark px-6 py-3 text-[10px] tracking-widest uppercase text-white transition-colors shrink-0 disabled:opacity-50"
      >
        {status === 'sending' ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white">
      {/* Top Newsletter Bar */}
      <div className="border-b border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg text-white mb-1">Stay Ahead of the Market</p>
            <p className="text-xs text-white/30">
              Curated market insights, off-market alerts, and exclusive listings — directly to your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-6">
              <p className="font-serif text-xl tracking-[0.2em] text-white">RADIUS°</p>
              <p className="text-[9px] tracking-[0.4em] uppercase text-gold">Luxury Real Estate</p>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mb-8">
              Southern California's most trusted luxury real estate advisory.
              Representing discerning buyers and sellers since 2006.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold text-white/30 transition-colors"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-5">{section}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-white/40 hover:text-gold transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/20 tracking-wide">
            © {new Date().getFullYear()} Radius Real Estate, Inc. All rights reserved.
          </p>
          <p className="text-[10px] text-white/20 tracking-wide">
            DRE #01234567 | Equal Housing Opportunity
          </p>
        </div>
      </div>
    </footer>
  )
}
