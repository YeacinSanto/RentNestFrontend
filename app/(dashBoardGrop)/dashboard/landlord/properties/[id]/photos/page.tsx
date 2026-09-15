import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyPhotosManager } from "@/app/(dashBoardGrop)/_components/PropertyPhotosManager"

interface Property {
  id: string
  title: string
  landlordId: string
  images?: string[]
}

interface CurrentUser {
  id: string
}

async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/properties/${id}`, {
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const result = await res.json()
  return result.success ? result.data : null
}

export default async function PropertyPhotosPage({ params }: PageProps<"/dashboard/landlord/properties/[id]/photos">) {
  const { id } = await params
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  const [property, user] = await Promise.all([getProperty(id), getCurrentUser(accessToken)])

  if (!property) {
    notFound()
  }

  if (!user || property.landlordId !== user.id) {
    redirect("/dashboard/landlord/properties")
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/landlord/properties"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to my listings
      </Link>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Photos for {property.title}</CardTitle>
          <CardDescription>Upload photos for tenants to see on this listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <PropertyPhotosManager propertyId={property.id} initialImages={property.images ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
