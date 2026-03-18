import { useEffect } from 'react'
import { X, BedDouble, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react'

function formatPrice(price) {
  if (price >= 1_000_000_000) {
    const b = price / 1_000_000_000
    return `$${b % 1 === 0 ? b.toFixed(0) : b.toFixed(2)}B`
  }
  if (price >= 1_000_000) {
    const m = price / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`
  }
  return `$${price.toLocaleString()}`
}

export default function PropertyModal({ property, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!property) return null

  const { address, city, state, price, beds, baths, sqft, image, tag, type, description } = property

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-charcoal/70 hover:bg-charcoal text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto shrink-0 relative">
          <img
            src={image}
            alt={address}
            className="w-full h-full object-cover"
          />
          {tag && (
            <span className="absolute top-4 left-4 bg-gold text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
              {tag}
            </span>
          )}
          <span className="absolute bottom-4 left-4 bg-charcoal/80 text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
            {type}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 p-8 md:p-10">
          <div className="flex items-start justify-between mb-1">
            <p className="font-serif text-2xl md:text-3xl text-charcoal leading-snug">{address}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 tracking-wide mb-4">
            <MapPin size={12} className="text-gold" />
            {city}, {state}
          </div>

          <p className="font-serif text-3xl text-gold mb-6">{formatPrice(price)}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 py-5 border-y border-stone-100 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <BedDouble size={15} className="text-gold" />
                <span className="font-medium text-charcoal">{beds}</span>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Beds</p>
            </div>
            <div className="w-px h-8 bg-stone-100" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Bath size={15} className="text-gold" />
                <span className="font-medium text-charcoal">{baths}</span>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">Baths</p>
            </div>
            {sqft > 0 && (
              <>
                <div className="w-px h-8 bg-stone-100" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Maximize size={15} className="text-gold" />
                    <span className="font-medium text-charcoal">{sqft.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Sq Ft</p>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-5">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className="mt-auto pt-4">
            <a
              href="#contact"
              onClick={onClose}
              className="btn-primary flex items-center justify-center gap-3 w-full"
            >
              Schedule a Viewing <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
