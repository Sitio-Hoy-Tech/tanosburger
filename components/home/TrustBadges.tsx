'use client'

import { motion } from 'motion/react'

const badges = [
  {
    icon: '⚡',
    title: 'Entrega rápida',
    desc: 'Delivery en tu zona en minutos',
  },
  {
    icon: '🍔',
    title: 'Ingredientes frescos',
    desc: 'Preparado al momento, siempre',
  },
  {
    icon: '💳',
    title: 'Pagá con tarjeta',
    desc: 'MercadoPago, débito y crédito',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
              className="flex flex-col sm:items-center sm:text-center gap-3 p-6 rounded-[var(--radius-lg)] border"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <span className="text-4xl" aria-hidden="true">{b.icon}</span>
              <h3
                className="font-bold text-base"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {b.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
