import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { UpdateProfileForm } from "@/app/(dashBoardGrop)/_components/UpdateProfileForm"

interface CurrentUser {
  name: string
  email: string
}

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const user = await getCurrentUser(accessToken)

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update your name or change your password.</p>
      </div>

      <Card className="mt-6">
        <CardContent>
          <UpdateProfileForm currentName={user.name} email={user.email} />
        </CardContent>
      </Card>
    </div>
  )
}
