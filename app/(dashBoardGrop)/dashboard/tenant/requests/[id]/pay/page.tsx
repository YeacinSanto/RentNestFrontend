import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PayButton } from "@/app/(dashBoardGrop)/_components/PayButton"

interface RentalRequest {
  id: string
  propertyId: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
}

interface Property {
  id: string
  title: string
  location: string
  price: string
}

interface Payment {
  id: string
  status: "PENDING" | "PAID" | "FAILED"
  rentalRequest: { id: string }
}

async function getRentalRequest(id: string, accessToken: string): Promise<RentalRequest | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals/${id}`, {
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

async function getMyPayments(accessToken: string): Promise<Payment[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

const paymentStatusVariant = {
  PENDING: "secondary",
  PAID: "default",
  FAILED: "destructive",
} as const

export default async function PayRentalRequestPage({ params }: PageProps<"/dashboard/tenant/requests/[id]/pay">) {
  const { id } = await params
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const rentalRequest = await getRentalRequest(id, accessToken)

  if (!rentalRequest) {
    notFound()
  }

  const [property, payments] = await Promise.all([
    getProperty(rentalRequest.propertyId),
    getMyPayments(accessToken),
  ])
  const existingPayment = payments.find((payment) => payment.rentalRequest.id === rentalRequest.id)

  const price = property ? Number.parseFloat(property.price) : NaN

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to dashboard
      </Link>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">{property ? property.title : "Property unavailable"}</CardTitle>
          {property && <CardDescription>{property.location}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {property && (
            <p className="text-2xl font-semibold text-foreground">
              {Number.isNaN(price) ? property.price : `€${price.toLocaleString()}`}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          )}

          {rentalRequest.status !== "APPROVED" ? (
            <p className="text-sm text-muted-foreground">
              This request must be approved by the landlord before you can pay for it. Current status:{" "}
              <Badge variant="secondary">{rentalRequest.status}</Badge>
            </p>
          ) : existingPayment ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Payment status:</span>
              <Badge variant={paymentStatusVariant[existingPayment.status]}>{existingPayment.status}</Badge>
            </div>
          ) : (
            <PayButton rentalRequestId={rentalRequest.id} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
