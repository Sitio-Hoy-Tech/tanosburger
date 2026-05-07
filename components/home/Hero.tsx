import Image from 'next/image'
import Link from 'next/link'
import HeroContent from './HeroContent'

export default function Hero() {
  return (
    <section className="relative w-full h-[92vh] min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/hamburguesa-1.jpg"
        alt="Hamburguesa Tanos Burger"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay gradiente desde abajo */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
        }}
        aria-hidden="true"
      />

      <HeroContent />
    </section>
  )
}
