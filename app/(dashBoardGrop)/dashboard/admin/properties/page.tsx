import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string
  title: string
  location: string
  price: string
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE"
  landlordId: string
  createdAt: string
}

async function getProperties(accessToken: string): Promise<Property[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/properties`, {
    headers: { Authorization: `Bearer ${accessToken}` },
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

export default async function AdminPropertiesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const properties = await getProperties(accessToken)

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <div className="mt-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Properties</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every property listed on RentNest, regardless of status.</p>
      </div>

      {properties.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">No properties found.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 mb-3 text-sm text-muted-foreground">
            {properties.length} {properties.length === 1 ? "property" : "properties"} total
          </p>
          <div className="overflow-x-auto rounded-4xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Landlord</th>
                  <th className="px-4 py-3 font-medium">Listed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property) => {
                  const price = Number.parseFloat(property.price)
                  return (
                    <tr key={property.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium text-foreground">{property.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{property.location}</td>
                      <td className="px-4 py-3 text-foreground">
                        {Number.isNaN(price) ? property.price : `€${price.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[property.status]}>{property.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{property.landlordId.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
