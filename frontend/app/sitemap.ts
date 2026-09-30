import type { MetadataRoute } from "next";
import { drupal } from "@/lib/drupal";
import type { DrupalNode } from "next-drupal";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const courses = await drupal.getResourceCollection<DrupalNode[]>("node--course", {
    params: { "filter[status]": 1 },
  });
  const lessons = await drupal.getResourceCollection<DrupalNode[]>("node--lesson", {
    params: { "filter[status]": 1 },
  });

  return [
    { url: `${base}/courses`, changeFrequency: "daily" },
    ...courses.map((c) => ({
      url: `${base}/courses/${c.id}`,
      lastModified: c.changed,
    })),
    ...lessons.map((l) => ({
      url: `${base}/lessons/${l.id}`,
      lastModified: l.changed,
    })),
  ];
}