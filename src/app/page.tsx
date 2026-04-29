import dynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/home/Hero'
import { AboutTeaser } from '@/components/sections/home/AboutTeaser'
import { ServicesTeaser } from '@/components/sections/home/ServicesTeaser'
import { ProcessTeaser } from '@/components/sections/home/ProcessTeaser'
import { ContactTeaser } from '@/components/sections/home/ContactTeaser'
import { PartnersMarquee } from '@/components/sections/home/PartnersMarquee'

// Horizontal scroll section: requires window dimensions at mount — must be client-only
const PortfolioTeaser = dynamic(
  () => import('@/components/sections/home/PortfolioTeaser'),
  { ssr: false },
)

export default function Home() {
  return (
    <main className="bg-void text-on-surface">
      <Navbar />
      <Hero />
      <AboutTeaser />
      <ServicesTeaser />
      <PortfolioTeaser />
      <ProcessTeaser />
      <PartnersMarquee />
      <ContactTeaser />
      <Footer />
    </main>
  )
}
