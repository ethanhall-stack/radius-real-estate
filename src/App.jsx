import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProperties from './components/FeaturedProperties'
import Stats from './components/Stats'
import AgentSection from './components/AgentSection'
import Testimonials from './components/Testimonials'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedProperties />
        <Stats />
        <AgentSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
