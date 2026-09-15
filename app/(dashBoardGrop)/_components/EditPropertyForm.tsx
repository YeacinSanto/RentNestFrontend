"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updatePropertyAction } from "../_action/landlordAction"

interface Property {
  id: string
  title: string
  description: string
  location: string
  price: string
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE"
}

export function EditPropertyForm({ property }: { property: Property }) {
  const [state, formAction, pending] = useActionState(updatePropertyAction, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state?.error])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="propertyId" value={property.id} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={property.title} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={property.description} rows={4} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={property.location} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price / month</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={property.price}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Availability status</Label>
        <select
          id="status"
          name="status"
          defaultValue={property.status}
          required
          className="h-9 rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="AVAILABLE" className="bg-background text-foreground">
            Available
          </option>
          <option value="RENTED" className="bg-background text-foreground">
            Rented
          </option>
          <option value="UNAVAILABLE" className="bg-background text-foreground">
            Unavailable
          </option>
        </select>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
