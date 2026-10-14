"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav className="flex rounded-full border border-line bg-white p-1 text-sm font-medium">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}/${rest}`}
          className={
            "rounded-full px-3 py-1 transition-colors " +
            (l === lang ? "bg-accent text-white" : "text-muted hover:text-ink")
          }
        >
          {l === "uk" ? "UA" : "EN"}
        </Link>
      ))}
    </nav>
  );
}