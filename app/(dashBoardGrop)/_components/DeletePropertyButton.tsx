"use client"

import { useActionState } from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { deletePropertyAction } from "../_action/landlordAction"

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [state, formAction, pending] = useActionState(deletePropertyAction, undefined)

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!confirm("Delete this listing? This can't be undone.")) {
          event.preventDefault()
        }
      }}
      className="inline-flex flex-col items-end gap-1"
    >
      <input type="hidden" name="propertyId" value={propertyId} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
      {state?.error && (
        <span className="flex items-center gap-1 text-xs text-destructive">
          <WarningCircleIcon size={14} />
          {state.error}
        </span>
      )}
    </form>
  )
}
