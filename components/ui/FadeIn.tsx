'use client'

import { motion } from 'motion/react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'none'
}

export default function FadeIn({ children, delay = 0, className, direction = 'up' }: FadeInProps) {
  const y = direction === 'up' ? 16 : direction === 'down' ? -16 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
