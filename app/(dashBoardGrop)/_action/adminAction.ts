"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

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

  revalidatePath("/dashboard/admin")
  return { success: true }
}
