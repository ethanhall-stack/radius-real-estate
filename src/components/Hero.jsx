import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

const propertyTypes = ['All Types', 'Single Family', 'Condominium', 'Penthouse', 'Estate', 'Villa']
const priceRanges = ['Any Price', '$1M – $3M', '$3M – $7M', '$7M – $15M', '$15M+']
const bedsOptions = ['Any Beds', '2+', '3+', '4+', '5+', '6+']

export default function Hero() {
  const [listingType, setListingType] = useState('For Sale')
  const [location, setLocation]       = useState('')
  const [activeType, setActiveType]   = useState('All Types')
  const [priceRange, setPriceRange]   = useState('Any Price')
  const [beds, setBeds]               = useState('Any Beds')

  function handleSearch() {
    window.dispatchEvent(new CustomEvent('idx-search', {
      detail: {
        city:         location.trim() || undefined,
        propertyType: activeType !== 'All Types' ? activeType : undefined,
        priceRange:   priceRange !== 'Any Price'  ? priceRange : undefined,
        beds:         beds !== 'Any Beds'         ? beds       : undefined,
        leaseOnly:    listingType === 'For Lease',
      },
    }))
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-end">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury estate"
          className="w-full h-full object-cover"
        />
        {/* Dark navy gradient overlay — Radius style */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12 w-full pb-20">
        {/* Headline */}
        <div className="mb-12">
          <p className="section-label text-gold-light mb-4">AI-Powered Real Estate Platform</p>
          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl text-white leading-tight max-w-2xl font-semibold">
            Find Your Next
            <em className="block not-italic text-gold">Exceptional</em>
            Home.
          </h1>
        </div>

        {/* Search Panel */}
        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 max-w-4xl">
          {/* Type Tabs */}
          <div className="flex gap-6 mb-6 border-b border-stone-200 pb-4">
            {['For Sale', 'For Lease'].map((tab) => (
              <button
                key={tab}
                onClick={() => setListingType(tab)}
                className={`text-xs tracking-widest uppercase pb-1 transition-all ${
                  tab === listingType
                    ? 'text-charcoal border-b-2 border-gold -mb-[17px]'
                    : 'text-stone-400 hover:text-charcoal'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="md:col-span-1 relative">
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Location
              </label>
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <MapPin size={13} className="text-gold shrink-0" />
                <input
                  type="text"
                  placeholder="City, neighborhood…"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full text-sm text-charcoal placeholder:text-stone-300 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Property Type
              </label>
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal outline-none bg-transparent appearance-none cursor-pointer"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal outline-none bg-transparent appearance-none cursor-pointer"
              >
                {priceRanges.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Beds */}
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-1.5">
                Bedrooms
              </label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full border-b border-stone-200 pb-2 text-sm text-charcoal outline-none bg-transparent appearance-none cursor-pointer"
              >
                {bedsOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-end">
            <button className="btn-primary flex items-center gap-3" onClick={handleSearch}>
              <Search size={14} />
              Search Properties
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-12 bottom-0 hidden lg:flex flex-col items-center gap-3 pb-8">
          <span className="text-[9px] text-white/30 tracking-widest uppercase rotate-90 origin-center">
            Scroll
          </span>
          <div className="w-px h-12 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-gold/60 animate-[scrollIndicator_2s_ease-in-out_infinite]" style={{ height: '40%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
