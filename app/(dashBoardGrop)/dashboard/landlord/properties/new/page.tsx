import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePropertyForm } from "@/app/(dashBoardGrop)/_components/CreatePropertyForm"

interface Category {
  id: string
  name: string
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

export default async function NewPropertyPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/landlord"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to dashboard
      </Link>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Create a new listing</CardTitle>
          <CardDescription>Fill in the details below to publish a new rental property.</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories exist yet, so a listing can&apos;t be created. Ask an admin to add one first.
            </p>
          ) : (
            <CreatePropertyForm categories={categories} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
