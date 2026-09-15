import Link from "next/link"
import { HouseLineIcon } from "@phosphor-icons/react/ssr"

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              <span className="flex size-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <HouseLineIcon size={18} weight="fill" />
              </span>
              RentNest
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Find your next place to rent, or list your property for the right tenant.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-foreground">Explore</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="transition-colors hover:text-foreground">
                    Properties
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground">Account</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="transition-colors hover:text-foreground">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition-colors hover:text-foreground">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
