import Link from 'next/link'

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

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoryChipsProps {
  categories: Category[]
}

export default function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?categoria=${cat.slug}`}
              className="flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-full)] border font-medium text-sm whitespace-nowrap transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <span aria-hidden="true">{categoryEmojis[cat.slug] ?? '🍽️'}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
