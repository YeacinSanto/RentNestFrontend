import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RentalRequestActions } from "@/app/(dashBoardGrop)/_components/RentalRequestActions"
import { ActionToast } from "@/app/_components/ActionToast"

interface RentalRequest {
  id: string
  tenantId: string
  propertyId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
  createdAt: string
}

interface Property {
  id: string
  title: string
}

async function getLandlordRequests(accessToken: string): Promise<RentalRequest[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data.result : []
}

async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

const statusVariant = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  COMPLETED: "outline",
} as const

export default async function LandlordRequestsPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const requests = await getLandlordRequests(accessToken)
  const properties = await Promise.all(requests.map((request) => getProperty(request.propertyId)))

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <ActionToast toasts={[{ param: "welcome", type: "success", message: "Welcome back!" }]} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Manage incoming requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and respond to requests for your properties.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/landlord/properties">My listings</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/landlord/properties/new">New listing</Link>
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">No rental requests yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-4xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Tenant</th>
                <th className="px-4 py-3 font-medium">Requested on</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((request, index) => {
                const property = properties[index]
                return (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {property ? property.title : "Property unavailable"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{request.tenantId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <RentalRequestActions requestId={request.id} status={request.status} />
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
