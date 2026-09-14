import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface RentalRequest {
  id: string
  tenantId: string
  propertyId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
  createdAt: string
}

async function getRentalRequests(accessToken: string): Promise<RentalRequest[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/rentals`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

const statusVariant = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  COMPLETED: "outline",
} as const

export default async function AdminRentalsPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const requests = await getRentalRequests(accessToken)

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <div className="mt-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Rental requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every rental request across the platform.</p>
      </div>

      {requests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">No rental requests found.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 mb-3 text-sm text-muted-foreground">
            {requests.length} {requests.length === 1 ? "request" : "requests"} total
          </p>
          <div className="overflow-x-auto rounded-4xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium">Requested on</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 text-muted-foreground">{request.propertyId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-muted-foreground">{request.tenantId.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
