"use client"

import { useEffect } from "react"
import Link from "next/link"
import { WarningIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PropertyError({
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
            <h1 className="font-heading text-xl font-semibold text-foreground">Couldn&apos;t load this property</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while fetching this listing. Try again, or head back to browse other properties.
            </p>
          </div>
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">Back to listings</Link>
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
