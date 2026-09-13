import Link from "next/link"
import { CompassIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CompassIcon size={32} />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Page not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
          </div>
          <Button asChild className="mt-2 w-full">
            <Link href="/">Back to listings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
