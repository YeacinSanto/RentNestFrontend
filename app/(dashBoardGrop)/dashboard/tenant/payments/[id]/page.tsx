import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Payment {
  id: string
  amount: string
  transactionId: string | null
  method: string | null
  provider: string
  paidAt: string | null
  createdAt: string
  status: "PENDING" | "PAID" | "FAILED"
  rentalRequest: {
    id: string
    propertyId: string
  }
}

interface Property {
  id: string
  title: string
  location: string
}

async function getPayment(id: string, accessToken: string): Promise<Payment | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
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
  PAID: "default",
  FAILED: "destructive",
} as const

export default async function PaymentDetailPage({ params }: PageProps<"/dashboard/tenant/payments/[id]">) {
  const { id } = await params
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const payment = await getPayment(id, accessToken)

  if (!payment) {
    notFound()
  }

  const property = await getProperty(payment.rentalRequest.propertyId)
  const amount = Number.parseFloat(payment.amount)

  const rows: { label: string; value: string }[] = [
    { label: "Property", value: property ? property.title : "Property unavailable" },
    { label: "Amount", value: Number.isNaN(amount) ? payment.amount : `€${amount.toLocaleString()}` },
    { label: "Provider", value: payment.provider },
    { label: "Method", value: payment.method ?? "—" },
    { label: "Transaction ID", value: payment.transactionId ?? "—" },
    { label: "Created on", value: new Date(payment.createdAt).toLocaleString() },
    { label: "Paid on", value: payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "—" },
  ]

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to dashboard
      </Link>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-heading text-xl font-semibold text-foreground">Payment details</h1>
            <Badge variant={statusVariant[payment.status]}>{payment.status}</Badge>
          </div>

          <dl className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
