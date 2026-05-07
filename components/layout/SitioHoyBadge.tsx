import Image from 'next/image'

export default function SitioHoyBadge() {
  return (
    <a
      href="https://sitiohoy.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-md backdrop-blur-sm transition-opacity opacity-40 hover:opacity-100"
      style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: '#555' }}
    >
      <span className="whitespace-nowrap">Desarrollado por</span>
      <Image
        src="/logo-sitiohoy.png"
        alt="SitioHoy"
        width={60}
        height={20}
        className="h-4 w-auto object-contain"
      />
    </a>
  )
}
