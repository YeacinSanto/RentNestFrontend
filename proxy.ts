import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type Role = "TENANT" | "LANDLORD" | "ADMIN"

const roleByPathPrefix: Record<string, Role> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
}

const dashboardPathByRole: Record<Role, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord/requests",
  ADMIN: "/dashboard/admin",
}

export async function proxy(request: NextRequest) {
  const matchedPrefix = Object.keys(roleByPathPrefix).find((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  )

  if (!matchedPrefix) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get("accessToken")?.value

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const result = await res.json()

  if (!result.success) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const requiredRole = roleByPathPrefix[matchedPrefix]
  const userRole: Role = result.data.role

  if (userRole !== requiredRole) {
    return NextResponse.redirect(new URL(dashboardPathByRole[userRole] ?? "/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
