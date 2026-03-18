const stats = [
  { value: '$4.2B+', label: 'In Sales Volume' },
  { value: '850+', label: 'Luxury Properties Sold' },
  { value: '18', label: 'Years of Excellence' },
  { value: '98%', label: 'Client Satisfaction' },
]

export default function Stats() {
  return (
    <section className="bg-charcoal py-20">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:px-10">
              <p className="font-serif text-4xl md:text-5xl text-gold mb-3">{stat.value}</p>
              <p className="text-[10px] tracking-widest uppercase text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
