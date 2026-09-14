"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateUserStatusAction } from "../_action/adminAction"

type Status = "ACTIVE" | "BANNED"

export function UserStatusAction({ userId, status }: { userId: string; status: Status }) {
  const [state, formAction, pending] = useActionState(updateUserStatusAction, undefined)

  useEffect(() => {
    if (state?.success) toast.success("User updated.")
    if (state?.error) toast.error(state.error)
  }, [state?.success, state?.error])

  const nextStatus = status === "ACTIVE" ? "BANNED" : "ACTIVE"

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={nextStatus} />
      <Button type="submit" size="sm" variant={status === "ACTIVE" ? "destructive" : "outline"} disabled={pending}>
        {pending ? "Updating..." : status === "ACTIVE" ? "Ban" : "Activate"}
      </Button>
    </form>
  )
}
