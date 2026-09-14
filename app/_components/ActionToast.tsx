"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface ToastSpec {
  param: string
  type: "success" | "error"
  message: string
}

/**
 * Fires a toast for a one-shot query param left behind by a server action's
 * redirect (e.g. `?created=1`), then strips it from the URL so refreshing or
 * sharing the link doesn't repeat the toast.
 */
export function ActionToast({ toasts }: { toasts: ToastSpec[] }) {
  useEffect(() => {
    const url = new URL(window.location.href)
    let changed = false

    for (const { param, type, message } of toasts) {
      if (url.searchParams.has(param)) {
        toast[type](message)
        url.searchParams.delete(param)
        changed = true
      }
    }

    if (changed) {
      window.history.replaceState(null, "", url.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
