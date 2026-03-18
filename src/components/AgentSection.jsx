import { ArrowRight, Award, Users, Home } from 'lucide-react'

const highlights = [
  { icon: Award, label: 'Top 1% Nationally', sub: 'Ranked by sales volume' },
  { icon: Users, label: '400+ Families Served', sub: 'Across three decades' },
  { icon: Home, label: 'Exclusive Off-Market', sub: 'Access to private listings' },
]

export default function AgentSection() {
  return (
    <section id="about" className="py-24 lg:py-36 bg-cream">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
                alt="Alexandra Monroe — Lead Agent"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -right-6 bottom-12 bg-white p-6 shadow-xl max-w-[220px] hidden lg:block">
              <p className="font-serif text-2xl text-gold mb-1">$21.5M</p>
              <p className="text-[10px] tracking-widest uppercase text-stone-400">Highest single sale</p>
              <div className="h-px bg-stone-100 my-3" />
              <p className="text-xs text-stone-500">8 Oceanview Terrace, Malibu</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="section-label mb-4">Powered by AI, Led by People</p>
            <h2 className="section-title mb-6">
              Alexandra Monroe
            </h2>
            <p className="font-serif italic text-xl text-gold mb-6 leading-relaxed">
              "Real estate isn't just a transaction. It's the beginning of the next chapter of your life."
            </p>
            <p className="text-stone-500 leading-relaxed mb-4 text-sm">
              With over 18 years navigating the Los Angeles luxury market, Alexandra has built an unrivaled
              reputation for discretion, precision, and a deeply personal approach to every engagement.
              Her intimate knowledge of premier neighborhoods — from the canyons of Bel Air to the
              coastlines of Malibu — positions her clients to make moves that others simply can't.
            </p>
            <p className="text-stone-500 leading-relaxed mb-10 text-sm">
              Alexandra's philosophy is simple: the right home doesn't just fit your life — it elevates it.
              She partners with each client to understand not just what they need today, but who they're becoming.
            </p>

            {/* Highlights */}
            <div className="space-y-5 mb-10">
              {highlights.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{label}</p>
                    <p className="text-xs text-stone-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn-primary inline-flex items-center gap-3">
              Schedule a Consultation <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
