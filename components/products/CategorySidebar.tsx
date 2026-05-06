'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

const categoryEmojis: Record<string, string> = {
  simples: '🍔',
  dobles: '🍔',
  triples: '🍔',
  'menu-infantil': '🧒',
  bebidas: '🥤',
  'bebidas-alcohol': '🍷',
  'papas-fritas': '🍟',
  extras: '➕',
}

export default function CategorySidebar({ categories }: { categories: Category[] }) {
  const params = useSearchParams()
  const current = params.get('categoria')

  return (
    <nav aria-label="Filtrar por categoría">
      {/* Mobile: chips scroll horizontal */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/menu"
          className={`flex-shrink-0 px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium border transition-colors whitespace-nowrap ${
            !current
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)]'
          }`}
        >
          Todo
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/menu?categoria=${cat.slug}`}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium border transition-colors whitespace-nowrap ${
              current === cat.slug
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)]'
            }`}
          >
            <span aria-hidden="true">{categoryEmojis[cat.slug] ?? '🍽️'}</span>
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Desktop: sidebar vertical */}
      <ul className="hidden lg:flex flex-col gap-1">
        <li>
          <Link
            href="/menu"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors w-full ${
              !current
                ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
                : 'hover:bg-[var(--color-surface)]'
            }`}
          >
            🍽️ Todos los productos
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/menu?categoria=${cat.slug}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors w-full ${
                current === cat.slug
                  ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
                  : 'hover:bg-[var(--color-surface)]'
              }`}
            >
              <span aria-hidden="true">{categoryEmojis[cat.slug] ?? '🍽️'}</span>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
