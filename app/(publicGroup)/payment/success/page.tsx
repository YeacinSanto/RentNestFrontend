import Link from "next/link"
import { CheckCircleIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircleIcon size={32} weight="fill" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Payment received</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks — your checkout completed successfully. It may take a moment for Stripe to confirm the payment,
              so check your dashboard for the latest status.
            </p>
          </div>
          <Button asChild className="mt-2 w-full">
            <Link href="/dashboard/tenant">Go to your dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
