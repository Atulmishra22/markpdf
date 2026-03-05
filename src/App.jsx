import Cursor from './components/shared/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Features from './components/Features'
import Demo from './components/Demo'
import Testimonial from './components/Testimonial'
import Stats from './components/Stats'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Demo />
        <Testimonial />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
