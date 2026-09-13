import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ReviewForm } from "@/app/(dashBoardGrop)/_components/ReviewForm"

interface RentalRequest {
  id: string
  propertyId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
  createdAt: string
}

interface Property {
  id: string
  title: string
}

interface Payment {
  id: string
  amount: string
  transactionId: string | null
  status: "PENDING" | "PAID" | "FAILED"
  paidAt: string | null
  createdAt: string
  rentalRequest: {
    id: string
    propertyId: string
  }
}

async function getRentalRequests(accessToken: string): Promise<RentalRequest[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data.result : []
}

async function getPayments(accessToken: string): Promise<Payment[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
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

const paymentStatusVariant = {
  PENDING: "secondary",
  PAID: "default",
  FAILED: "destructive",
} as const

export default async function TenantDashboardPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const [rentalRequests, payments] = await Promise.all([
    getRentalRequests(accessToken),
    getPayments(accessToken),
  ])
  const properties = await Promise.all(rentalRequests.map((request) => getProperty(request.propertyId)))
  const paymentProperties = await Promise.all(
    payments.map((payment) => getProperty(payment.rentalRequest.propertyId))
  )

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Your rental requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track the status of every property you&apos;ve requested to rent.
      </p>

      {rentalRequests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t requested to rent any properties yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-4xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Requested on</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rentalRequests.map((request, index) => {
                const property = properties[index]
                return (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {property ? property.title : "Property unavailable"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        if (request.status !== "APPROVED") {
                          return <span className="text-xs text-muted-foreground">—</span>
                        }

                        const payment = payments.find((p) => p.rentalRequest.id === request.id)

                        if (payment?.status === "PAID") {
                          return <Badge variant="default">Paid</Badge>
                        }

                        if (payment) {
                          return (
                            <Link
                              href={`/dashboard/tenant/requests/${request.id}/pay`}
                              className="font-medium text-muted-foreground underline underline-offset-4"
                            >
                              {payment.status === "FAILED" ? "Payment failed" : "Payment pending"}
                            </Link>
                          )
                        }

                        return (
                          <Link
                            href={`/dashboard/tenant/requests/${request.id}/pay`}
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            Pay now
                          </Link>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      {request.status === "COMPLETED" ? (
                        <ReviewForm propertyId={request.propertyId} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-12 font-heading text-2xl font-semibold tracking-tight text-foreground">Payment history</h2>
      <p className="mt-1 text-sm text-muted-foreground">Every payment you&apos;ve made for approved rentals.</p>

      {payments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t made any payments yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-4xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Paid on</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment, index) => {
                const property = paymentProperties[index]
                const amount = Number.parseFloat(payment.amount)
                return (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {property ? property.title : "Property unavailable"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {Number.isNaN(amount) ? payment.amount : `€${amount.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={paymentStatusVariant[payment.status]}>{payment.status}</Badge>
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
