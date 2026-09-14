"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { initiatePaymentAction } from "../_action/tenantAction"

export function PayButton({ rentalRequestId }: { rentalRequestId: string }) {
  const [state, formAction, pending] = useActionState(initiatePaymentAction, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state?.error])

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="rentalRequestId" value={rentalRequestId} />

      {state?.error && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Redirecting to Stripe..." : "Pay with Stripe"}
      </Button>
    </form>
  )
}
