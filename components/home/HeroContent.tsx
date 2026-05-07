'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export default function HeroContent() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end px-5 pb-12 sm:px-10 sm:pb-16 max-w-4xl">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-primary)' }}
      >
        Delivery · Retiro en local
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Las mejores{' '}
        <span style={{ color: 'var(--color-primary)' }}>hamburguesas</span>{' '}
        te esperan
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
        className="text-base sm:text-lg text-white/80 mb-8 max-w-xl"
      >
        Ingredientes frescos, sabor único y precio accesible. Pagá con tarjeta o efectivo.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href="/menu"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/50"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Ver menú
        </Link>
        <a
          href="https://wa.me/543329404361"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-[var(--radius-md)] font-bold text-sm border-2 border-white text-white transition-all hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
        >
          Pedir por WhatsApp
        </a>
      </motion.div>
    </div>
  )
}
