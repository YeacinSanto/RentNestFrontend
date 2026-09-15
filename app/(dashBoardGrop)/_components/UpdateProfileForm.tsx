"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfileAction } from "@/app/(authGroup)/_action/authAction"

export function UpdateProfileForm({ currentName, email }: { currentName: string; email: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined)

  useEffect(() => {
    if (state?.success) toast.success("Profile updated.")
    if (state?.error) toast.error(state.error)
  }, [state?.success, state?.error])

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
        <p className="text-xs text-muted-foreground">Email can&apos;t be changed.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={currentName} required />
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-sm font-medium text-foreground">Change password</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" />
          </div>
        </div>
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
