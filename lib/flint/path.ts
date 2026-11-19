import { stripLocalePrefix } from "@/lib/i18n/paths";

export function isFlintPath(pathname: string) {
  const path = stripLocalePrefix(pathname);
  return path === "/flint" || path.startsWith("/flint/");
}
