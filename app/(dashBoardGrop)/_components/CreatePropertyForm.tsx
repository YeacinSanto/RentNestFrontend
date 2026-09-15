"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPropertyAction } from "../_action/landlordAction"

interface Category {
  id: string
  name: string
}

export function CreatePropertyForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createPropertyAction, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state?.error])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Bright 2-bedroom apartment" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the property..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="City or area" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price / month</Label>
          <Input id="price" name="price" type="number" min={0} step="0.01" placeholder="1200" required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryName">Property type</Label>
        <select
          id="categoryName"
          name="categoryName"
          defaultValue=""
          required
          className="h-9 rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="" disabled className="bg-background text-foreground">
            Select a type
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name} className="bg-background text-foreground">
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Creating..." : "Create listing"}
      </Button>
    </form>
  )
}
