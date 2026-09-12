"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { EyeIcon, EyeSlashIcon, HouseLineIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "../_action/authAction"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <span className="mb-1 flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <HouseLineIcon size={20} weight="fill" />
        </span>
        <CardTitle className="text-xl">Log in to RentNest</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
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
                autoComplete="current-password"
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

          {state?.error && (
            <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default LoginForm
