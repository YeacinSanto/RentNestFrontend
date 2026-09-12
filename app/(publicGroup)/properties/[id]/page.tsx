import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPinIcon } from "@phosphor-icons/react/ssr"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE"
  createdAt: string
}

async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

const statusVariant = {
  AVAILABLE: "default",
  RENTED: "secondary",
  UNAVAILABLE: "secondary",
} as const

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const price = Number.parseFloat(property.price)

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to listings
        </Link>

        <Card className="mt-6">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                  {property.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                  <MapPinIcon size={16} />
                  {property.location}
                </p>
              </div>
              <Badge variant={statusVariant[property.status]}>{property.status}</Badge>
            </div>

            <p className="text-3xl font-semibold text-foreground">
              {Number.isNaN(price) ? property.price : `€${price.toLocaleString()}`}
              <span className="ml-1 text-base font-normal text-muted-foreground">/mo</span>
            </p>

            <div className="border-t border-border pt-6">
              <h2 className="mb-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Description
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-foreground">{property.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
