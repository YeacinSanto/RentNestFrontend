import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeletePropertyButton } from "@/app/(dashBoardGrop)/_components/DeletePropertyButton"

interface CurrentUser {
  id: string
}

interface Property {
  id: string
  title: string
  location: string
  price: string
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE"
  landlordId: string
  category?: { id: string; name: string }
}

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

async function getAvailableProperties(): Promise<Property[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

const statusVariant = {
  AVAILABLE: "default",
  RENTED: "secondary",
  UNAVAILABLE: "secondary",
} as const

export default async function LandlordPropertiesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const user = await getCurrentUser(accessToken)
  const allAvailableProperties = await getAvailableProperties()
  const myProperties = user ? allAvailableProperties.filter((property) => property.landlordId === user.id) : []

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">My listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Properties you&apos;ve listed on RentNest.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/landlord/requests">Requests</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/landlord/properties/new">New listing</Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
        Only <span className="font-medium">available</span> listings can be shown here right now — the API has no
        endpoint yet to fetch a landlord&apos;s rented or unavailable properties.
      </div>

      {myProperties.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t listed any available properties yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-4xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myProperties.map((property) => {
                const price = Number.parseFloat(property.price)
                return (
                  <tr key={property.id}>
                    <td className="px-4 py-3 font-medium text-foreground">{property.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{property.location}</td>
                    <td className="px-4 py-3 text-foreground">
                      {Number.isNaN(price) ? property.price : `€${price.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[property.status]}>{property.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/properties/${property.id}`}
                          className="font-medium text-primary underline underline-offset-4"
                        >
                          View
                        </Link>
                        <DeletePropertyButton propertyId={property.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
