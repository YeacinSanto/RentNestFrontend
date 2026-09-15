"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </Button>
  )
}
