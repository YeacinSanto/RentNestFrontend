import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCategoryForm } from "@/app/(dashBoardGrop)/_components/CreateCategoryForm"
import { ActionToast } from "@/app/_components/ActionToast"

interface Category {
  id: string
  name: string
  description: string
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : []
}

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <ActionToast toasts={[{ param: "created", type: "success", message: "Category created." }]} />

      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to overview
      </Link>

      <div className="mt-6 rounded-4xl border border-border">
        {categories.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No categories exist yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((category) => (
              <li key={category.id} className="px-4 py-3">
                <p className="font-medium text-foreground">{category.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Create a new category</CardTitle>
          <CardDescription>Property types landlords can choose from when listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
