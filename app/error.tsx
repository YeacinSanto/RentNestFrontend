"use client"

import { useEffect } from "react"
import Link from "next/link"
import { WarningIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <WarningIcon size={32} weight="fill" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn&apos;t load this page. This is usually temporary — try again in a moment.
            </p>
          </div>
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button className="flex-1" onClick={() => retry()}>
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
