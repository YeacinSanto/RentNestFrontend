"use client"

import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { ImageSquareIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { uploadPropertyImagesAction } from "../_action/landlordAction"

const MAX_FILES = 8
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export function PropertyPhotosManager({
  propertyId,
  initialImages,
}: {
  propertyId: string
  initialImages: string[]
}) {
  const [validationError, setValidationError] = useState<string | null>(null)
  const [state, formAction, pending] = useActionState(uploadPropertyImagesAction, undefined)

  const images = state?.images ?? initialImages

  useEffect(() => {
    if (state?.success) toast.success("Photos uploaded.")
    if (state?.error) toast.error(state.error)
  }, [state?.success, state?.error])

  function validateFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      setValidationError(null)
      return
    }

    if (files.length > MAX_FILES) {
      setValidationError(`You can upload at most ${MAX_FILES} photos at once.`)
      return
    }

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError(`${file.name} isn't a supported image type.`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setValidationError(`${file.name} is larger than 5MB.`)
        return
      }
    }

    setValidationError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((src) => (
            <div key={src} className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-4xl border border-dashed border-border py-16 text-center">
          <ImageSquareIcon size={28} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No photos uploaded yet.</p>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="propertyId" value={propertyId} />
        <input
          type="file"
          name="images"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          onChange={(event) => validateFiles(event.target.files)}
          className="text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Up to {MAX_FILES} photos, 5MB max each. JPEG, PNG, WebP, or AVIF only.
        </p>

        {validationError && (
          <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <WarningCircleIcon size={18} className="mt-0.5 shrink-0" />
            <p>{validationError}</p>
          </div>
        )}

        <Button type="submit" disabled={pending || !!validationError} className="w-full sm:w-auto">
          {pending ? "Uploading..." : "Upload photos"}
        </Button>
      </form>
    </div>
  )
}
