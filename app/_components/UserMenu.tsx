"use client"

import { useTransition } from "react"
import Link from "next/link"
import { CaretDownIcon, SquaresFourIcon, UserCircleIcon, SignOutIcon } from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function UserMenu({ user }: { user: CurrentUser }) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(() => {
      logoutAction()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 aria-expanded:bg-muted">
        <Avatar>
          <AvatarFallback className="bg-primary/15 font-medium text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <CaretDownIcon size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col gap-1 px-3 py-2">
          <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          <Badge variant="secondary" className="mt-1 w-fit">
            {user.role}
          </Badge>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardPathByRole[user.role]}>
            <SquaresFourIcon size={16} />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserCircleIcon size={16} />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" disabled={isPending} onSelect={handleLogout}>
          <SignOutIcon size={16} />
          {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
