"use client"

import { useState } from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-muted">
        <img src={images[index]} alt={title} className="h-full w-full object-cover" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((current) => (current === 0 ? images.length - 1 : current - 1))}
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-background"
            >
              <CaretLeftIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((current) => (current === images.length - 1 ? 0 : current + 1))}
              aria-label="Next photo"
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-background"
            >
              <CaretRightIcon size={16} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                i === index ? "border-primary" : "border-transparent"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
