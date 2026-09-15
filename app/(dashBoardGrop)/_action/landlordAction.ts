"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type RentalStatusActionState =
  | { success?: boolean; status?: "APPROVED" | "REJECTED" | "COMPLETED"; error?: string }
  | undefined

export async function updateRentalRequestStatusAction(
  prevState: RentalStatusActionState,
  formData: FormData
): Promise<RentalStatusActionState> {
  const requestId = formData.get("requestId")
  const status = formData.get("status") as "APPROVED" | "REJECTED" | "COMPLETED"

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/requests/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Something went wrong. Please try again." }
  }

  if (status === "COMPLETED") {
    const propertyId = result.data.propertyId

    await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "AVAILABLE" }),
    })

    revalidatePath("/dashboard/landlord/properties")
  }

  revalidatePath("/dashboard/landlord/requests")
  return { success: true, status }
}

export type CreatePropertyState = { error?: string } | undefined

export async function createPropertyAction(
  prevState: CreatePropertyState,
  formData: FormData
): Promise<CreatePropertyState> {
  const title = formData.get("title")
  const description = formData.get("description")
  const location = formData.get("location")
  const price = formData.get("price")
  const categoryName = formData.get("categoryName")

  if (!title || !description || !location || !price || !categoryName) {
    return { error: "Please fill in every field." }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, description, location, price, categoryName }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not create the property. Please try again." }
  }

  revalidatePath("/dashboard/landlord/properties")
  redirect("/dashboard/landlord/properties?created=1")
}

export type UpdatePropertyState = { error?: string } | undefined

export async function updatePropertyAction(
  prevState: UpdatePropertyState,
  formData: FormData
): Promise<UpdatePropertyState> {
  const propertyId = formData.get("propertyId")
  const title = formData.get("title")
  const description = formData.get("description")
  const location = formData.get("location")
  const price = formData.get("price")
  const status = formData.get("status")

  if (!title || !description || !location || !price || !status) {
    return { error: "Please fill in every field." }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, description, location, price, status }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not update the listing. Please try again." }
  }

  revalidatePath("/dashboard/landlord/properties")
  redirect("/dashboard/landlord/properties?updated=1")
}

export type DeletePropertyState = { success?: boolean; error?: string } | undefined

export async function deletePropertyAction(
  prevState: DeletePropertyState,
  formData: FormData
): Promise<DeletePropertyState> {
  const propertyId = formData.get("propertyId")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not delete the listing. Please try again." }
  }

  revalidatePath("/dashboard/landlord/properties")
  return { success: true }
}

export type UploadPropertyImagesState = { success?: boolean; images?: string[]; error?: string } | undefined

export async function uploadPropertyImagesAction(
  prevState: UploadPropertyImagesState,
  formData: FormData
): Promise<UploadPropertyImagesState> {
  const propertyId = formData.get("propertyId")
  formData.delete("propertyId")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/landlord/properties/${propertyId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not upload photos. Please try again." }
  }

  revalidatePath(`/dashboard/landlord/properties/${propertyId}/photos`)
  return { success: true, images: result.data.images ?? [] }
}
