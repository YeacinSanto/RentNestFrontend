import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-linear-to-b from-primary/10 to-transparent">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-9 w-full max-w-md" />
          <Skeleton className="mt-3 h-5 w-full max-w-sm" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-28 w-full rounded-4xl" />

        <Skeleton className="mt-6 h-4 w-40" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-4xl border border-border p-6">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
