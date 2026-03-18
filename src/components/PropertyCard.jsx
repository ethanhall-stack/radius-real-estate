import { BedDouble, Bath, Maximize, Heart } from 'lucide-react'
import { sendPropertyInterest, getLeadIdentity } from '../services/webhook'

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

function formatSqft(sqft) {
  return sqft.toLocaleString()
}

export default function PropertyCard({ property, onClick, isSaved = false, onSaveToggle, onLoginRequired }) {
  const { address, city, state, price, beds, baths, sqft, tag, image } = property

  const handleFavorite = (e) => {
    e.stopPropagation()
    const { name, email } = getLeadIdentity()
    if (!name || !email) {
      onLoginRequired?.()
      return
    }
    const next = !isSaved
    onSaveToggle?.(property.id, next)
    if (next) sendPropertyInterest(property)
  }

  return (
    <article className="group cursor-pointer" onClick={onClick}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] mb-4">
        <img
          src={image}
          alt={address}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tag */}
        {tag && (
          <span className="absolute top-4 left-4 bg-gold text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
            {tag}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          title={isSaved ? 'Remove from saved' : 'Save property'}
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
        >
          <Heart
            size={14}
            className={isSaved ? 'fill-gold text-gold' : 'text-stone-400'}
          />
        </button>

        {/* Price overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <button onClick={onClick} className="btn-outline-white w-full text-center text-[10px]">View Property</button>
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="font-serif text-lg text-charcoal leading-snug">{address}</p>
            <p className="text-xs text-stone-400 tracking-wide mt-0.5">
              {city}, {state}
            </p>
          </div>
          <p className="font-serif text-lg text-gold shrink-0 ml-4">{formatPrice(price)}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-stone-100">
          <span className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <BedDouble size={13} className="text-gold" />
            {beds} Beds
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <Bath size={13} className="text-gold" />
            {baths} Baths
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <Maximize size={13} className="text-gold" />
            {formatSqft(sqft)} sqft
          </span>
        </div>
      </div>
    </article>
  )
}
