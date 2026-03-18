import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Listings', href: '#listings' },
  { label: 'Neighborhoods', href: '#neighborhoods' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'Contact', href: '#contact' },
]

function RadiusLogo({ light = false }) {
  return (
    <a href="#" className="flex items-center gap-2.5 select-none">
      {/* Circle mark */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke={light ? 'white' : '#5553E0'} strokeWidth="2" />
        <circle cx="14" cy="14" r="5" fill={light ? 'white' : '#5553E0'} />
      </svg>
      <div className="leading-none">
        <span className={`font-sans font-semibold text-base tracking-[0.15em] ${light ? 'text-white' : 'text-white'}`}>
          RADIUS°
        </span>
        <span className={`block text-[8px] tracking-[0.35em] uppercase font-light mt-0.5 ${light ? 'text-white/50' : 'text-white/50'}`}>
          Real Estate
        </span>
      </div>
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-charcoal/95 backdrop-blur-sm border-b border-white/5 py-4' : 'bg-charcoal/80 backdrop-blur-sm py-6'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <RadiusLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-widest uppercase font-sans text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden md:block text-xs tracking-widest uppercase font-sans text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="#contact"
            className="hidden md:block text-xs tracking-widest uppercase font-sans bg-gold hover:bg-gold-dark text-white px-5 py-2.5 transition-colors duration-300"
          >
            Request Demo
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-charcoal border-t border-white/10 shadow-lg">
          <nav className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-center mt-2"
            >
              Request Demo
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
