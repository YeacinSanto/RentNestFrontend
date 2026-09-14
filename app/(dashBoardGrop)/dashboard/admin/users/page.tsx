import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { UsersTable } from "@/app/(dashBoardGrop)/_components/UsersTable"

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
        <UsersTable users={users} />
      )}
    </div>
  )
}
