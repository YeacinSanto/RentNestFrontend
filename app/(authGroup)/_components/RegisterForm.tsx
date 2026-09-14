"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { EyeIcon, EyeSlashIcon, HouseLineIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "../_action/authAction"

type RegisterRole = "TENANT" | "LANDLORD"

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<RegisterRole>("TENANT")
  const [state, formAction, pending] = useActionState(registerAction, undefined)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state?.error])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <span className="mb-1 flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <HouseLineIcon size={20} weight="fill" />
        </span>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>Sign up to start browsing or listing properties.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>I am a</Label>
            <input type="hidden" name="role" value={role} />
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={role === "TENANT" ? "default" : "outline"}
                onClick={() => setRole("TENANT")}
              >
                Tenant
              </Button>
              <Button
                type="button"
                variant={role === "LANDLORD" ? "default" : "outline"}
                onClick={() => setRole("LANDLORD")}
              >
                Landlord
              </Button>
            </div>
          </div>

          {state?.error && (
            <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Signing up..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
