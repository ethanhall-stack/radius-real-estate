import { Quote } from 'lucide-react'
import { testimonials } from '../data/properties'

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="section-label mb-4">Client Stories</p>
          <h2 className="section-title">
            Relationships Built on
            <em className="block not-italic text-gold">Trust & Results.</em>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-cream p-8 lg:p-10 flex flex-col"
            >
              <Quote size={28} className="text-gold/40 mb-6 shrink-0" />
              <p className="text-stone-600 text-sm leading-relaxed italic font-serif mb-8 flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="text-sm font-medium text-charcoal">{t.name}</p>
                  <p className="text-[10px] tracking-wide text-stone-400 uppercase">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
