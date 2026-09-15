import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
}

interface PropertyFiltersProps {
  categories: Category[]
  defaultValues: {
    location?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
  hasActiveFilters: boolean
}

export function PropertyFilters({ categories, defaultValues, hasActiveFilters }: PropertyFiltersProps) {
  return (
    <div className="rounded-4xl border border-border bg-card p-4">
      <form method="GET" className="grid grid-cols-2 items-end gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1 lg:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="City or area" defaultValue={defaultValues.location} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Property type</Label>
          <select
            id="category"
            name="category"
            defaultValue={defaultValues.category ?? ""}
            className="h-9 rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <option value="" className="bg-background text-foreground">
              Any type
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name} className="bg-background text-foreground">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            min={0}
            placeholder="€0"
            defaultValue={defaultValues.minPrice}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min={0}
            placeholder="No limit"
            defaultValue={defaultValues.maxPrice}
          />
        </div>

        <div className="col-span-2 flex gap-2 sm:col-span-4 lg:col-span-1 ">
          <Button type="submit" className="flex-1">
            Search
          </Button>
          {hasActiveFilters && (
            <Button asChild variant="outline">
              <Link href="/">Clear</Link>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
