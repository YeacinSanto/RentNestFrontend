import { PropertyCard } from "@/app/_components/PropertyCard"
import { PropertyFilters } from "@/app/_components/PropertyFilters"

interface Category {
  id: string
  name: string
  description: string
}

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  category?: Category
  images?: string[]
}

interface Filters {
  location?: string
  category?: string
  minPrice?: string
  maxPrice?: string
}

async function getProperties(filters: Filters): Promise<Property[]> {
  const query = new URLSearchParams()
  if (filters.location) query.set("location", filters.location)
  if (filters.category) query.set("category", filters.category)
  if (filters.minPrice) query.set("minPrice", filters.minPrice)
  if (filters.maxPrice) query.set("maxPrice", filters.maxPrice)

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties?${query.toString()}`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const resolvedSearchParams = await searchParams

  const filters: Filters = {
    location: firstValue(resolvedSearchParams.location),
    category: firstValue(resolvedSearchParams.category),
    minPrice: firstValue(resolvedSearchParams.minPrice),
    maxPrice: firstValue(resolvedSearchParams.maxPrice),
  }
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const [properties, categories] = await Promise.all([getProperties(filters), getCategories()])

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <PropertyFilters categories={categories} defaultValues={filters} hasActiveFilters={hasActiveFilters} />

        {properties.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? "No properties match your search." : "No properties available right now."}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 mb-6 text-sm text-muted-foreground">
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
