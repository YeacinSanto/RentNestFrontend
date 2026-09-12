import { PropertyCard } from "@/app/_components/PropertyCard"

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  category?: { id: string; name: string; description: string }
}

async function getProperties(): Promise<Property[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

export default async function Home() {
  const properties = await getProperties()

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-linear-to-b from-primary/10 to-transparent">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">Available now</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-foreground">
            Find your next place to call home
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Browse available rentals listed by landlords across the platform.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
            <p className="text-sm text-muted-foreground">No properties available right now.</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {properties.length} {properties.length === 1 ? "property" : "properties"} available
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
