import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActionToast } from "@/app/_components/ActionToast"

interface RentalRequest {
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
}

async function getCount(path: string, accessToken: string): Promise<number> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  if (!result.success) return 0

  const data = Array.isArray(result.data) ? result.data : result.data.result
  return Array.isArray(data) ? data.length : 0
}

async function getPendingRequestsCount(accessToken: string): Promise<number> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/rentals`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  if (!result.success) return 0

  const requests: RentalRequest[] = Array.isArray(result.data) ? result.data : result.data.result
  return requests.filter((request) => request.status === "PENDING").length
}

export default async function AdminOverviewPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const [totalUsers, totalProperties, pendingRequests] = await Promise.all([
    getCount("/admin/users", accessToken),
    getCount("/admin/properties", accessToken),
    getPendingRequestsCount(accessToken),
  ])

  const stats = [
    { label: "Total users", value: totalUsers, href: "/dashboard/admin/users" },
    { label: "Total properties", value: totalProperties, href: "/dashboard/admin/properties" },
    { label: "Pending requests", value: pendingRequests, href: "/dashboard/admin/rentals" },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <ActionToast toasts={[{ param: "welcome", type: "success", message: "Welcome back!" }]} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform health at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/users">Users</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/categories">Categories</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
