import type { MetadataRoute } from "next";
import type { DrupalNode } from "next-drupal";
import { drupal } from "@/lib/drupal";
import { locales } from "@/lib/i18n";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    const courses = await drupal.getResourceCollection<DrupalNode[]>("node--course", {
      locale: lang,
      defaultLocale: "none",
      params: { "filter[status]": 1 },
    });
    const lessons = await drupal.getResourceCollection<DrupalNode[]>("node--lesson", {
      locale: lang,
      defaultLocale: "none",
      params: { "filter[status]": 1 },
    });
    entries.push({ url: `${base}/${lang}/courses`, changeFrequency: "daily" });
    for (const c of courses) {
      entries.push({ url: `${base}/${lang}/courses/${c.id}`, lastModified: c.changed });
    }
    for (const l of lessons) {
      entries.push({ url: `${base}/${lang}/lessons/${l.id}`, lastModified: l.changed });
    }
  }
  return entries;
}