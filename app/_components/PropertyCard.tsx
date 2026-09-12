import Link from "next/link"
import { MapPinIcon } from "@phosphor-icons/react/ssr"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
}

export function PropertyCard({ property }: { property: Property }) {
  const price = Number.parseFloat(property.price)

  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <Card className="h-full justify-between transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug">{property.title}</CardTitle>
            {property.category && (
              <Badge variant="secondary" className="shrink-0">
                {property.category.name}
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-1">
            <MapPinIcon size={14} className="shrink-0" />
            <span className="truncate">{property.location}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{property.description}</p>
        </CardContent>

        <CardFooter className="items-baseline justify-between border-t border-border/60">
          <span className="text-xl font-semibold text-foreground">
            {Number.isNaN(price) ? property.price : `€${price.toLocaleString()}`}
            <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
          </span>
          <span className="text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View details →
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
