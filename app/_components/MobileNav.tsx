"use client"

import { useTransition } from "react"
import Link from "next/link"
import { ListIcon, SquaresFourIcon, SignOutIcon } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/app/_components/ThemeToggle"
import { logoutAction } from "@/app/(authGroup)/_action/authAction"

interface CurrentUser {
  name: string
  email: string
  role: "TENANT" | "LANDLORD" | "ADMIN"
}

const dashboardPathByRole: Record<CurrentUser["role"], string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord/requests",
  ADMIN: "/dashboard/admin",
}

export function MobileNav({ user }: { user: CurrentUser | null }) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(() => {
      logoutAction()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 aria-expanded:bg-muted"
      >
        <ListIcon size={20} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {user && (
          <>
            <div className="flex flex-col gap-1 px-3 py-2">
              <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              <Badge variant="secondary" className="mt-1 w-fit">
                {user.role}
              </Badge>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/properties">Properties</Link>
        </DropdownMenuItem>

        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm text-foreground">Theme</span>
          <ThemeToggle />
        </div>

        <DropdownMenuSeparator />

        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={dashboardPathByRole[user.role]}>
                <SquaresFourIcon size={16} />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" disabled={isPending} onSelect={handleLogout}>
              <SignOutIcon size={16} />
              {isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">Log in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Sign up</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
