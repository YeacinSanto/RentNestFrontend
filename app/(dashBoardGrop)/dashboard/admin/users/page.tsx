import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { UserStatusAction } from "@/app/(dashBoardGrop)/_components/UserStatusAction"

interface User {
  id: string
  name: string
  email: string
  role: "TENANT" | "LANDLORD" | "ADMIN"
  status: "ACTIVE" | "BANNED"
  createdAt: string
}

async function getUsers(accessToken: string): Promise<User[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data.result : []
}

const roleVariant = {
  TENANT: "secondary",
  LANDLORD: "default",
  ADMIN: "outline",
} as const

const statusVariant = {
  ACTIVE: "default",
  BANNED: "destructive",
} as const

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const users = await getUsers(accessToken)

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <div className="mt-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage every account on RentNest.</p>
      </div>

      {users.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-24 text-center">
          <p className="text-sm text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 mb-3 text-sm text-muted-foreground">
            {users.length} {users.length === 1 ? "user" : "users"} total
          </p>
          <div className="overflow-x-auto rounded-4xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <UserStatusAction userId={user.id} status={user.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
