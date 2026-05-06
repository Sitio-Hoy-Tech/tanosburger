export default function ProductLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2 aspect-square skeleton rounded-[var(--radius-lg)]" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="skeleton h-8 rounded w-3/4" />
          <div className="skeleton h-6 rounded w-1/4" />
          <div className="skeleton h-4 rounded w-full mt-2" />
          <div className="skeleton h-4 rounded w-5/6" />
          <div className="skeleton h-4 rounded w-4/6" />
          <div className="skeleton h-12 rounded-[var(--radius-md)] mt-6" />
        </div>
      </div>
    </div>
  )
}
