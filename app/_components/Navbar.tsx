import Link from "next/link"
import { cookies } from "next/headers"
import { HouseLineIcon } from "@phosphor-icons/react/ssr"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/app/_components/UserMenu"
import { ThemeToggle } from "@/app/_components/ThemeToggle"
import { MobileNav } from "@/app/_components/MobileNav"

interface CurrentUser {
  id: string
  name: string
  email: string
  role: "TENANT" | "LANDLORD" | "ADMIN"
}

async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) return null

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            <span className="flex size-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <HouseLineIcon size={18} weight="fill" />
            </span>
            RentNest
          </Link>

          <Link
            href="/properties"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Properties
          </Link>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="sm:hidden">
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  )
}
