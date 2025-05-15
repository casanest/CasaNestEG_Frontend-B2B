import { createNavigation } from "next-intl/navigation"
import { intlConfig } from "./settings"

export const { Link, redirect, usePathname, useRouter } =
createNavigation(intlConfig)