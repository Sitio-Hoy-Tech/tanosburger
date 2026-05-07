'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface MobileMenuProps {
  links: { href: string; label: string }[]
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="p-2 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--neutral-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        <Menu size={22} strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            role="dialog"
            aria-label="Menú de navegación"
            className="fixed top-0 left-0 h-screen w-72 z-[70] flex flex-col shadow-xl border-r border-[var(--color-border)] bg-white"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Menú
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--neutral-100)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="flex flex-col px-4 py-6 gap-1 flex-1 bg-white">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-3 rounded-[var(--radius-md)] font-medium text-base transition-colors hover:bg-[var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  )
}
