import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { MapPinIcon } from "@phosphor-icons/react/ssr"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RequestRentalForm } from "@/app/(publicGroup)/_components/RequestRentalForm"
import { PropertyGallery } from "@/app/(publicGroup)/_components/PropertyGallery"

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE"
  images?: string[]
  createdAt: string
}

interface CurrentUser {
  role: "TENANT" | "LANDLORD" | "ADMIN"
}

type RentalRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"

interface RentalRequest {
  propertyId: string
  status: RentalRequestStatus
}

async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

async function getMyRentalRequests(accessToken: string): Promise<RentalRequest[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data.result : []
}

const statusVariant = {
  AVAILABLE: "default",
  RENTED: "secondary",
  UNAVAILABLE: "secondary",
} as const

const requestStatusVariant = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  COMPLETED: "outline",
} as const

export default async function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  const { id } = await params
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const [property, user] = await Promise.all([
    getProperty(id),
    accessToken ? getCurrentUser(accessToken) : Promise.resolve(null),
  ])

  if (!property) {
    notFound()
  }

  const myRequests =
    user?.role === "TENANT" && accessToken ? await getMyRentalRequests(accessToken) : []
  const existingRequest = myRequests.find(
    (request) => request.propertyId === property.id && request.status !== "REJECTED"
  )

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
            <PropertyGallery images={property.images ?? []} title={property.title} />

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

            <div className="border-t border-border pt-6">
              {property.status !== "AVAILABLE" ? (
                <p className="text-sm text-muted-foreground">This property isn&apos;t available to rent right now.</p>
              ) : !user ? (
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                    Log in
                  </Link>{" "}
                  as a tenant to request to rent this property.
                </p>
              ) : user.role !== "TENANT" ? (
                <p className="text-sm text-muted-foreground">Only tenants can request to rent properties.</p>
              ) : existingRequest ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">You&apos;ve already requested this property —</span>
                  <Badge variant={requestStatusVariant[existingRequest.status]}>{existingRequest.status}</Badge>
                </div>
              ) : (
                <RequestRentalForm propertyId={property.id} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
