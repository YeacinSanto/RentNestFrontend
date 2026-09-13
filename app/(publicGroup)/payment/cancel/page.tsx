import Link from "next/link"
import { XCircleIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircleIcon size={32} weight="fill" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Payment cancelled</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You cancelled the checkout, so nothing was charged. Head back to your dashboard to check the status of
              your rental request.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/dashboard/tenant">Back to your dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
