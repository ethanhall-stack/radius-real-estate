import { useState, useEffect, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'
import PropertyCard from './PropertyCard'
import PropertyModal from './PropertyModal'
import LeadCaptureModal from './LeadCaptureModal'
import { fetchListings } from '../services/idx'
import { properties as mockProperties } from '../data/properties'

const CITY_FILTERS = ['All', 'Beverly Hills', 'Malibu', 'Bel Air', 'Hollywood Hills']
const PAGE_SIZE = 6

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter]     = useState('All')
  const [properties, setProperties]         = useState([])
  const [total, setTotal]                   = useState(0)
  const [loading, setLoading]               = useState(true)
  const [loadingMore, setLoadingMore]       = useState(false)
  const [error, setError]                   = useState(null)
  const [searchParams, setSearchParams]     = useState({})
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [captureProperty, setCaptureProperty]   = useState(null)
  const [savedIds, setSavedIds]                 = useState(new Set())

  const load = useCallback(async (city, search, skip, append) => {
    skip === 0 ? setLoading(true) : setLoadingMore(true)
    setError(null)
    try {
      const result = await fetchListings({
        city:         city !== 'All' ? city : search.city,
        propertyType: search.propertyType,
        priceRange:   search.priceRange,
        beds:         search.beds,
        leaseOnly:    search.leaseOnly,
        top:          PAGE_SIZE,
        skip,
      })
      setTotal(result.total)
      setProperties((prev) => append ? [...prev, ...result.properties] : result.properties)
    } catch (err) {
      console.error('[FeaturedProperties]', err)
      if (skip === 0) {
        setError(err.message)
        setProperties(mockProperties)
        setTotal(mockProperties.length)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // Initial load
  useEffect(() => { load('All', {}, 0, false) }, [load])

  // Listen for search events dispatched by Hero
  useEffect(() => {
    function onSearch(e) {
      setActiveFilter('All')
      setSearchParams(e.detail)
      load('All', e.detail, 0, false)
    }
    window.addEventListener('idx-search', onSearch)
    return () => window.removeEventListener('idx-search', onSearch)
  }, [load])

  function handleFilterChange(filter) {
    setActiveFilter(filter)
    load(filter, searchParams, 0, false)
  }

  function handleLoadMore() {
    load(activeFilter, searchParams, properties.length, true)
  }

  return (
    <section id="listings" className="py-24 lg:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="section-label mb-3">Curated Collection</p>
            <h2 className="section-title">
              Exceptional Homes,
              <br />
              <em className="not-italic text-gold">Extraordinary Lives.</em>
            </h2>
          </div>
          <a href="#" className="flex items-center gap-2 text-xs tracking-widest uppercase text-gold hover:gap-4 transition-all duration-300">
            View All Listings <ArrowRight size={14} />
          </a>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 flex-wrap mb-10">
          {CITY_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`text-[10px] tracking-widest uppercase px-5 py-2 transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-charcoal text-white'
                  : 'text-stone-400 hover:text-charcoal border border-transparent hover:border-stone-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-stone-200 aspect-[4/3] mb-4" />
                <div className="bg-stone-200 h-4 w-3/4 mb-2" />
                <div className="bg-stone-200 h-5 w-1/2 mb-3" />
                <div className="bg-stone-100 h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {error && (
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-6">
                Showing curated listings — live feed temporarily unavailable.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => setSelectedProperty(property)}
                  isSaved={savedIds.has(property.id)}
                  onSaveToggle={(id, next) => setSavedIds((prev) => {
                    const s = new Set(prev)
                    next ? s.add(id) : s.delete(id)
                    return s
                  })}
                  onLoginRequired={() => setCaptureProperty(property)}
                />
              ))}
              {properties.length === 0 && (
                <p className="col-span-3 text-center text-stone-400 py-12 text-sm tracking-wide">
                  No listings found matching your criteria.
                </p>
              )}
            </div>
          </>
        )}

        {/* Load More */}
        {!loading && properties.length < total && (
          <div className="text-center mt-16">
            <button className="btn-outline" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? 'Loading…' : 'Load More Properties'}
            </button>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Lead Capture Modal — shown when unauthenticated user tries to favorite */}
      {captureProperty && (
        <LeadCaptureModal
          property={captureProperty}
          onSaved={(id) => setSavedIds((prev) => new Set([...prev, id]))}
          onClose={() => setCaptureProperty(null)}
        />
      )}
    </section>
  )
}
