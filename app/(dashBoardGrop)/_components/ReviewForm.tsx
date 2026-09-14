"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { StarIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createReviewAction } from "../_action/tenantAction"

export function ReviewForm({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [state, formAction, pending] = useActionState(createReviewAction, undefined)

  useEffect(() => {
    if (state?.success) toast.success("Thanks for your review!")
    if (state?.error) toast.error(state.error)
  }, [state?.success, state?.error])

  if (state?.success) {
    return <p className="text-sm font-medium text-primary">Thanks for your review!</p>
  }

  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        Leave a review
      </Button>
    )
  }

  return (
    <form action={formAction} className="flex w-64 flex-col gap-2 rounded-2xl border border-border bg-card p-3">
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
          >
            <StarIcon
              size={20}
              weight={value <= rating ? "fill" : "regular"}
              className={value <= rating ? "text-primary" : "text-muted-foreground"}
            />
          </button>
        ))}
      </div>

      <Textarea name="comment" placeholder="Share your experience..." rows={3} required />

      {state?.error && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <WarningCircleIcon size={16} className="mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending || rating === 0}>
          {pending ? "Submitting..." : "Submit review"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
