"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type RequestRentalState = { error?: string } | undefined

export async function requestRentalAction(
  prevState: RequestRentalState,
  formData: FormData
): Promise<RequestRentalState> {
  const propertyId = formData.get("propertyId")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ propertyId }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not submit your request. Please try again." }
  }

  redirect("/dashboard/tenant")
}

export type InitiatePaymentState = { error?: string } | undefined

export async function initiatePaymentAction(
  prevState: InitiatePaymentState,
  formData: FormData
): Promise<InitiatePaymentState> {
  const rentalRequestId = formData.get("rentalRequestId")

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ rentalRequestId }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not start payment. Please try again." }
  }

  const checkoutUrl: string | null = result.data.checkoutUrl

  redirect(checkoutUrl ?? "/dashboard/tenant")
}

export type ReviewActionState = { success?: boolean; error?: string } | undefined

export async function createReviewAction(
  prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const propertyId = formData.get("propertyId")
  const rating = formData.get("rating")
  const comment = formData.get("comment")

  if (!propertyId || !rating || Number(rating) < 1 || !comment) {
    return { error: "Please pick a rating and add a comment." }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ propertyId, rating: Number(rating), comment }),
  })

  const result = await res.json()

  if (!result.success) {
    return { error: result.error ?? "Could not submit your review. Please try again." }
  }

  return { success: true }
}
