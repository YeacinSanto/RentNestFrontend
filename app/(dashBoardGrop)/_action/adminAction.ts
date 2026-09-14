"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type UpdateUserStatusState = { success?: boolean; error?: string } | undefined

export async function updateUserStatusAction(
  prevState: UpdateUserStatusState,
  formData: FormData
): Promise<UpdateUserStatusState> {
  const userId = formData.get("userId")
  const status = formData.get("status")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ status }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not update the user. Please try again." }
  }

  revalidatePath("/dashboard/admin/users")
  return { success: true }
}

export type CreateCategoryState = { error?: string } | undefined

export async function createCategoryAction(
  prevState: CreateCategoryState,
  formData: FormData
): Promise<CreateCategoryState> {
  const name = formData.get("name")
  const description = formData.get("description")

  if (!name || !description) {
    return { error: "Please fill in every field." }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name, description }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not create the category. Please try again." }
  }

  revalidatePath("/dashboard/admin/categories")
  redirect("/dashboard/admin/categories?created=1")
}
