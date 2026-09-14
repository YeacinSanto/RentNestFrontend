"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateRentalRequestStatusAction } from "../_action/landlordAction"

type Status = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"

export function RentalRequestActions({ requestId, status }: { requestId: string; status: Status }) {
  const [state, formAction, pending] = useActionState(updateRentalRequestStatusAction, undefined)

  useEffect(() => {
    if (state?.success) toast.success("Request updated.")
    if (state?.error) toast.error(state.error)
  }, [state?.success, state?.error])

  if (status === "REJECTED" || status === "COMPLETED") {
    return <span className="text-xs text-muted-foreground">No actions available</span>
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        {status === "PENDING" && (
          <>
            <form action={formAction}>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="status" value="APPROVED" />
              <Button type="submit" size="sm" disabled={pending}>
                Approve
              </Button>
            </form>

            <form action={formAction}>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="status" value="REJECTED" />
              <Button type="submit" size="sm" variant="outline" disabled={pending}>
                Reject
              </Button>
            </form>
          </>
        )}

        {status === "APPROVED" && (
          <form action={formAction}>
            <input type="hidden" name="requestId" value={requestId} />
            <input type="hidden" name="status" value="COMPLETED" />
            <Button type="submit" size="sm" disabled={pending}>
              Mark completed
            </Button>
          </form>
        )}
      </div>

      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  )
}
